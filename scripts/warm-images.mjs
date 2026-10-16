// Pre-generates optimized images so visitors never wait on a cold
// /_next/image conversion (each first-time size re-downloads the original
// from the API and encodes AVIF, ~2s+ per image).
//
// Usage: node scripts/warm-images.mjs [baseUrl] [--concurrency=4] [--max-width=2048]
// Run after each deploy, or after publishing new trips/posts.

const args = process.argv.slice(2)
const base = (args.find((a) => !a.startsWith("--")) ?? "https://walkthroughnepal.com").replace(/\/$/, "")
const flag = (name, fallback) => Number(args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1] ?? fallback)
const concurrency = flag("concurrency", 4)
const maxWidth = flag("max-width", 2048)

const ACCEPT = "image/avif,image/webp,*/*"

async function pool(items, limit, fn) {
  let i = 0
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) await fn(items[i++])
  })
  await Promise.all(workers)
}

function imageUrls(html) {
  const urls = new Set()
  for (const m of html.matchAll(/\/_next\/image\?url=[^"'\s,]+/g)) {
    const u = m[0].replace(/&amp;/g, "&")
    const w = Number(new URL(u, base).searchParams.get("w"))
    if (w && w <= maxWidth) urls.add(u)
  }
  return urls
}

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
const pages = [base, ...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, base))]
console.log(`Scanning ${pages.length} pages on ${base}`)

const images = new Set()
await pool(pages, concurrency, async (page) => {
  try {
    const html = await (await fetch(page)).text()
    for (const u of imageUrls(html)) images.add(u)
  } catch (e) {
    console.warn(`page failed: ${page} (${e.message})`)
  }
})
console.log(`Warming ${images.size} image variants (max width ${maxWidth}, concurrency ${concurrency})`)

let done = 0
let cold = 0
let failed = 0
const started = Date.now()
await pool([...images], concurrency, async (u) => {
  try {
    const res = await fetch(base + u, { headers: { Accept: ACCEPT } })
    await res.arrayBuffer()
    if (!res.ok) failed++
    else if (res.headers.get("x-nextjs-cache") !== "HIT") cold++
  } catch {
    failed++
  }
  if (++done % 50 === 0) console.log(`  ${done}/${images.size}`)
})
console.log(`Done in ${Math.round((Date.now() - started) / 1000)}s: ${cold} generated, ${images.size - cold - failed} already cached, ${failed} failed`)
