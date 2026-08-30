import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const CMS_API_BASE = process.env.CMS_API_URL ?? "https://cms.walkthroughnepal.com"

// ponytail: fixed list, keep in sync with be/src/lib/i18n.ts LOCALES
const LOCALE_PATTERN = /^\/(de|es|fr|it|pt|ru|ja)(\/.*)?$/i
const LOCALE_COOKIE = "wt-locale"

// ponytail: in-memory per-instance TTL cache; multi-instance/CDN edge would need a shared store
type Entry = { redirect: { destination: string; type: string } | null; expires: number }
const cache = new Map<string, Entry>()
const TTL = 60_000

async function resolveRedirect(source: string): Promise<{ destination: string; type: string } | null> {
  const cached = cache.get(source)
  if (cached && cached.expires > Date.now()) return cached.redirect
  let redirect: { destination: string; type: string } | null = null
  try {
    const res = await fetch(`${CMS_API_BASE}/api/redirects/resolve?source=${encodeURIComponent(source)}`, {
      cache: "no-store",
    })
    if (res.ok) {
      const body = await res.json().catch(() => null)
      if (body?.destination) redirect = { destination: body.destination, type: body.type }
    }
  } catch {
    return null
  }
  cache.set(source, { redirect, expires: Date.now() + TTL })
  return redirect
}

export async function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") return NextResponse.next()

  const { pathname, search } = request.nextUrl

  // Locale routing: `/{code}/...` are REAL routes (app/[...rest]) — the proxy
  // only tags the request (x-locale + wt-locale cookie). en stays at root.
  // ponytail: no rewrite — Next's client router resolved the rewritten URL's original
  // path (`/de/...`) against the route table, found nothing, and injected a 404.
  const localeMatch = LOCALE_PATTERN.exec(pathname)
  if (localeMatch) {
    const locale = localeMatch[1].toLowerCase()
    const newReqHeaders = new Headers(request.headers)
    newReqHeaders.set("x-locale", locale)
    const res = NextResponse.next({ request: { headers: newReqHeaders } })
    res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 31536000, sameSite: "lax" })
    return res
  }

  // Persisted-language redirect: any EN path → /{code}/... (root → /{code}/) so the
  // user stays in their chosen locale. SEO/dev/CDN assets stay at root.
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (cookie && /^(de|es|fr|it|pt|ru|ja)$/.test(cookie)) {
    const excluded = /^\/(cms|uploads)(\/|$)/.test(pathname) || pathname === "/opengraph-image"
    if (!excluded) {
      const dest = pathname === "/" ? `/${cookie}/` : `/${cookie}${pathname}`
      return NextResponse.redirect(new URL(`${dest}${search}`, request.url), 302)
    }
  }

  const redirect = await resolveRedirect(pathname)
  if (!redirect || redirect.destination === pathname) return NextResponse.next()

  return NextResponse.redirect(new URL(redirect.destination, request.url), redirect.type === "permanent" ? 301 : 302)
}

export const config = {
  matcher: [
    // exclude API routes, Next internals, and static assets
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|css|js|mjs|json|woff2?|ttf|eot|map|xml|txt|mp4|webm|pdf)$).*)",
  ],
}
