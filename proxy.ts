import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const CMS_API_BASE = process.env.CMS_API_URL ?? "https://cms.walkthroughnepal.com"

// ponytail: fixed list, keep in sync with be/src/lib/i18n.ts LOCALES
const LOCALE_PATTERN = /^\/(de|es|fr|it|pt)(\/.*)?$/i
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

  // Locale routing: `/{code}/...` → internal path + ?locale= + header; en stays at root.
  const localeMatch = LOCALE_PATTERN.exec(pathname)
  let locale: string = "en"
  let internalPath = pathname
  if (localeMatch) {
    locale = localeMatch[1].toLowerCase()
    internalPath = pathname.slice(localeMatch[1].length) || "/"
    const url = new URL(`${internalPath}${search}`, request.url)
    // ponytail: query param keeps cache entries distinct per locale (untranslated
    // locales reuse the base slug, which would otherwise collide with the en route)
    url.searchParams.set("locale", locale)
    // forward x-locale on the *request* headers so server components' headers() sees it
    const newReqHeaders = new Headers(request.headers)
    newReqHeaders.set("x-locale", locale)
    const res = NextResponse.rewrite(url, { request: { headers: newReqHeaders } })
    res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 31536000, sameSite: "lax" })
    return res
  }

  // Persisted-language redirect: bare root with a locale cookie → /{code}/
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value
  if (pathname === "/" && cookie && /^(de|es|fr|it|pt)$/.test(cookie) && cookie !== locale) {
    return NextResponse.redirect(new URL(`/${cookie}/`, request.url), 302)
  }

  const redirect = await resolveRedirect(pathname)
  if (!redirect || redirect.destination === pathname) {
    const res = NextResponse.next()
    res.headers.set("x-locale", "en")
    return res
  }

  return NextResponse.redirect(new URL(redirect.destination, request.url), redirect.type === "permanent" ? 301 : 302)
}

export const config = {
  matcher: [
    // exclude API routes, Next internals, and static assets
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|css|js|mjs|json|woff2?|ttf|eot|map|xml|txt|mp4|webm|pdf)$).*)",
  ],
}
