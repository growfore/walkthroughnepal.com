/**
 * One-time migration script: WordPress → BE API
 *
 * Fetches all WP blog posts, downloads + uploads images to BE,
 * creates blog posts on BE via API.
 *
 * Usage: npx tsx scripts/migrate-wp.ts
 */

const WP_API = "https://walkthroughnepal.com/wp-json/wp/v2"
const BE_API = "https://api.walkthroughnepal.com"
const WRITER_ID = "cmqqc0257000feukfmmlaicli"
const CATEGORY_ID = "cmqqc02520005eukfxxz0s5c8"

// ── helpers ──────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim()
}

/** Extract all WP upload URLs from HTML (covers src, srcset, href) */
function extractWpImageUrls(html: string): string[] {
  const urls: string[] = []
  const regex = /https:\/\/walkthroughnepal\.com\/wp-content\/uploads\/[^"'\s>]+/gi
  let m: RegExpExecArray | null
  while ((m = regex.exec(html)) !== null) urls.push(m[0])
  return [...new Set(urls)]
}

/** Download a URL → upload to BE → return the new relative URL */
async function uploadImage(url: string, label: string): Promise<string | null> {
  try {
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`download failed: ${resp.status}`)
    const blob = await resp.blob()

    const filename = url.split("/").pop() || "image.webp"
    const form = new FormData()
    form.append("file", blob, filename)

    const uploadResp = await fetch(`${BE_API}/api/v1/upload/local`, {
      method: "POST",
      body: form,
    })
    if (!uploadResp.ok) {
      const text = await uploadResp.text()
      throw new Error(`upload failed: ${uploadResp.status} — ${text.slice(0, 200)}`)
    }
    const result = await uploadResp.json()
    console.log(`  ✓ ${label}: ${filename} → ${result.url}`)
    return result.url as string
  } catch (err) {
    console.error(`  ✗ ${label}:`, (err as Error).message)
    return null
  }
}

// ── main ─────────────────────────────────────────────────────────────

async function main() {
  // 1. Fetch WP posts
  console.log("Fetching WP posts...")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let posts: any[] = await fetch(`${WP_API}/posts?per_page=100&_embed=1`).then((r) => r.json())

  // Optional: filter by slug argument
  const testSlug = process.argv[2]
  if (testSlug) {
    posts = posts.filter((p) => p.slug === testSlug)
    console.log(`Filtered to "${testSlug}" only\n`)
  }
  console.log(`Migrating ${posts.length} posts\n`)

  let created = 0
  let skipped = 0
  let failed = 0

  for (const post of posts) {
    const slug = post.slug as string
    const title = post.title.rendered as string
    console.log(`\n── ${title} (${slug}) ──`)

    // Check if slug already exists on BE
    const existing = await fetch(`${BE_API}/api/v1/blogs/resolve/${slug}`).then((r) => (r.ok ? r.json() : null)).catch(() => null)
    if (existing) {
      console.log(`  → slug already exists on BE, skipping`)
      skipped++
      continue
    }

    // 2. Upload featured image
    let coverImage: string | null = null
    const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0]
    if (featuredMedia?.source_url) {
      coverImage = await uploadImage(featuredMedia.source_url, "featured")
    }

    // 3. Parse + upload content images
    let content = post.content.rendered as string
    const imageUrls = extractWpImageUrls(content)
    const urlMap = new Map<string, string>()

    if (imageUrls.length > 0) {
      console.log(`  Content images: ${imageUrls.length}`)
      for (const [i, imgUrl] of imageUrls.entries()) {
        const newUrl = await uploadImage(imgUrl, `img ${i + 1}/${imageUrls.length}`)
        if (newUrl) urlMap.set(imgUrl, newUrl)
      }
    }

    // 4. Rewrite all WP image URLs in content (covers src, srcset, href, etc.)
    for (const [oldUrl, newUrl] of urlMap) {
      content = content.replaceAll(oldUrl, newUrl)
    }

    // 5. Strip excerpt
    const metaDescription = stripHtml(post.excerpt.rendered)

    // 6. Create blog on BE
    const dateStr = (post.date as string).includes("Z") ? post.date : `${post.date}Z`
    const body: Record<string, unknown> = {
      title,
      slug,
      content,
      category: CATEGORY_ID,
      writerId: WRITER_ID,
      metaDescription,
      metaTitle: title,
      postType: "blog",
      publishedAt: dateStr,
      createdAt: dateStr,
      tags: (post.tags as string[])?.join(", ") || "",
    }
    if (coverImage) body.coverImage = coverImage

    try {
      const resp = await fetch(`${BE_API}/api/v1/blogs/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!resp.ok) {
        const text = await resp.text()
        throw new Error(`BE returned ${resp.status}: ${text.slice(0, 300)}`)
      }
      const result = await resp.json()
      console.log(`  ✓ Created: ${result.newBlog?.slug || slug}`)
      created++
    } catch (err) {
      console.error(`  ✗ Failed to create:`, (err as Error).message)
      failed++
    }
  }

  console.log(`\n═══════════════════════════════════`)
  console.log(`Total: ${posts.length} | Created: ${created} | Skipped: ${skipped} | Failed: ${failed}`)
}

main().catch(console.error)
