import React from "react"
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer"
import type { Activity } from "./types"
import type { SiteConfig } from "./siteConfig"
import { decodeHtmlEntities } from "./html-decoder"

Font.register({
  family: "Body",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf", fontWeight: 700 },
  ],
})

const orange = "#D4520C"
const navy = "#0F2B3D"
const ink = "#162B38"
const mute = "#5F6B72"
const hairline = "#E5E2DA"

const M = 8 // 1 unit margin

const styles = StyleSheet.create({
  page: {
    paddingTop: 100,
    paddingBottom: 80,
    paddingLeft: 50,
    paddingRight: 50,
    fontFamily: "Body",
    fontSize: 14,
    color: ink,
    lineHeight: 1.5,
  },

  // ── Header (letterhead) ──
  header: {
    position: "absolute",
    top: 30,
    left: 50,
    right: 50,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: navy,
    flex: 1,
  },
  headerLogo: {
    width: 100,
    height: 40,
    objectFit: "contain",
  },
  headerLine: {
    height: 2,
    backgroundColor: orange,
    marginTop: M,
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
  },
  footerLine: {
    height: 1,
    backgroundColor: hairline,
    marginBottom: M,
  },
  footerText: {
    fontSize: 10,
    color: mute,
    textAlign: "left",
  },

  sectionDivider: {
    height: 2,
    backgroundColor: orange,
    width: 40,
    marginBottom: M,
  },

  // ── Itinerary ──
  dayCard: {
    marginBottom: M,
    borderWidth: 1,
    borderColor: hairline,
    borderRadius: 4,
    padding: M,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: navy,
    marginBottom: 4,
  },
  dayMeta: {
    flexDirection: "row",
    gap: M,
    marginBottom: 4,
  },
  dayMetaText: {
    fontSize: 10,
    color: mute,
  },
  dayDesc: {
    fontSize: 14,
    color: ink,
    lineHeight: 1.5,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: navy,
    marginBottom: M,
  },
  // ── List titles ──
  listTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: navy,
    marginBottom: M,
  },
  listSection: {
    marginBottom: M,
  },
  listItem: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 3,
    alignItems: "flex-start",
  },
  listDash: {
    width: 12,
    fontSize: 14,
    color: ink,
    flexShrink: 0,
  },
  listItemText: {
    fontSize: 14,
    color: ink,
    flex: 1,
    lineHeight: 1.6,
  },

  // ── Highlights ──
  highlightRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
    alignItems: "flex-start",
  },
  highlightBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: orange,
    marginTop: 5,
    flexShrink: 0,
  },
  highlightText: {
    fontSize: 9,
    color: ink,
    flex: 1,
    lineHeight: 1.6,
  },

  // ── Facts ──
  factsRow: {
    marginBottom: M,
  },
  factLine: {
    flexDirection: "row",
    marginBottom: 2,
  },
  factLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: navy,
    width: 120,
    flexShrink: 0,
  },
  factValue: {
    fontSize: 14,
    color: ink,
    flex: 1,
  },

  // ── Additional info ──
  addInfoTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: navy,
    marginBottom: 4,
    marginTop: 10,
  },
  addInfoDesc: {
    fontSize: 9,
    color: ink,
    lineHeight: 1.65,
    marginBottom: 6,
  },
})

function cellText(s: string): string {
  return decodeHtmlEntities(s).replace(/<[^>]*>/g, "").trim()
}

function parseInlineSegments(html: string): { text: string; bold?: boolean; italic?: boolean }[] {
  const segments: { text: string; bold?: boolean; italic?: boolean }[] = []
  const regex = /<(strong|b|em|i)>([\s\S]*?)<\/\1>/gi
  let lastIndex = 0
  let match
  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) segments.push({ text: html.slice(lastIndex, match.index) })
    const tag = match[1].toLowerCase()
    segments.push({
      text: match[2],
      bold: tag === "strong" || tag === "b",
      italic: tag === "em" || tag === "i",
    })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < html.length) segments.push({ text: html.slice(lastIndex) })
  if (segments.length === 0) segments.push({ text: html })
  return segments
}

function InlineText({ html, style }: { html: string; style?: any }) {
  const clean = html.replace(/<[^>]*>/g, "").trim()
  if (!clean) return null
  const segments = parseInlineSegments(html)
  if (segments.length === 1 && !segments[0].bold && !segments[0].italic) {
    return <Text style={style}>{clean}</Text>
  }
  return (
    <Text style={style}>
      {segments.map((seg, i) => {
        const text = seg.text.replace(/<[^>]*>/g, "")
        if (!text.trim()) return null
        if (seg.bold || seg.italic) {
          return (
            <Text
              key={i}
              style={{
                fontWeight: seg.bold ? 700 : undefined,
                fontStyle: seg.italic ? "italic" : undefined,
              }}
            >
              {text}
            </Text>
          )
        }
        return text
      })}
    </Text>
  )
}

function extractLiItems(html: string): string[] {
  const decoded = decodeHtmlEntities(html)
  const items: string[] = []
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi
  let match
  while ((match = liRegex.exec(decoded)) !== null) {
    items.push(match[1].trim())
  }
  if (items.length === 0) {
    const text = decoded.replace(/<[^>]*>/g, "").trim()
    if (text) items.push(text)
  }
  return items
}

function renderTextContent(html: string): React.ReactNode[] {
  const elements: React.ReactNode[] = []
  let content = decodeHtmlEntities(html)

  // Extract headings
  const headings: { level: number; text: string }[] = []
  let match
  const headingRegex = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({ level: parseInt(match[1]), text: match[2].replace(/<[^>]*>/g, "").trim() })
  }
  content = content.replace(/<h[23][^>]*>[\s\S]*?<\/h[23]>/gi, "\n")

  // Extract list items
  const listItems: string[] = []
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi
  while ((match = liRegex.exec(content)) !== null) {
    listItems.push(match[1].trim())
  }
  content = content.replace(/<li[^>]*>[\s\S]*?<\/li>/gi, "\n")
  content = content.replace(/<\/?[uo]l[^>]*>/gi, "\n")

  // Clean block tags
  content = content.replace(/<\/?p[^>]*>/gi, "\n")
  content = content.replace(/<br\s*\/?>/gi, "\n")

  // Render headings
  for (const h of headings) {
    elements.push(
      <Text
        key={`h${h.level}_${elements.length}`}
        style={{
          fontSize: h.level === 2 ? 18 : 16,
          fontWeight: 700,
          color: navy,
          marginBottom: 6,
          marginTop: h.level === 2 ? 12 : 8,
        }}
      >
        {h.text}
      </Text>,
    )
  }

  // Render list items
  for (const item of listItems) {
    const clean = item.replace(/<[^>]*>/g, "").trim()
    if (!clean) continue
    elements.push(
      <View key={`li_${elements.length}`} style={{ flexDirection: "row", gap: 6, marginBottom: 3 }}>
        <Text style={{ width: 12, color: ink, flexShrink: 0, fontSize: 14 }}>•</Text>
        <InlineText html={item} style={{ flex: 1, fontSize: 14, color: ink, lineHeight: 1.5 }} />
      </View>,
    )
  }

  // Render text lines
  const lines = content.split("\n")
  for (const line of lines) {
    const stripped = line.replace(/<[^>]*>/g, "").trim()
    if (!stripped) continue
    elements.push(
      <InlineText
        key={`t_${elements.length}`}
        html={line}
        style={{ fontSize: 14, color: ink, lineHeight: 1.5, marginBottom: 4 }}
      />,
    )
  }

  return elements
}

// ponytail: regex block extraction, breaks if tables nest or have >
type Block =
  | { k: "text"; text: string }
  | { k: "table"; rows: string[][] }
  | { k: "img"; src: string }
  | { k: "map"; src: string }

function extractBlocks(html: string, imgBase: string): Block[] {
  const arr: Block[] = []
  let r = html
  for (;;) {
    const tableMatch = r.match(/<table[\s\S]*?<\/table>/i)
    const imgMatch = r.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i)
    const iframeMatch = r.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*><\/iframe>/i)

    const candidates: { idx: number; k: string; match: RegExpMatchArray }[] = []
    if (tableMatch && tableMatch.index !== undefined) candidates.push({ idx: tableMatch.index, k: "table", match: tableMatch })
    if (imgMatch && imgMatch.index !== undefined) candidates.push({ idx: imgMatch.index, k: "img", match: imgMatch })
    if (iframeMatch && iframeMatch.index !== undefined) candidates.push({ idx: iframeMatch.index, k: "iframe", match: iframeMatch })
    candidates.sort((a, b) => a.idx - b.idx)

    if (candidates.length === 0) break

    const first = candidates[0]
    const before = r.slice(0, first.idx).trim()
    if (before) arr.push({ k: "text", text: before })

    if (first.k === "table") {
      const tbl = first.match[0]
      const rows: string[][] = []
      ;[...tbl.matchAll(/<tr[\s\S]*?<\/tr>/gi)].forEach((r2) => {
        const cells: string[] = []
        ;[...r2[0].matchAll(/<t[dh][\s\S]*?<\/t[dh]>/gi)].forEach((c) => cells.push(cellText(c[0])))
        if (cells.length) rows.push(cells)
      })
      arr.push({ k: "table", rows })
      r = r.slice(first.idx + tbl.length).trim()
    } else {
      let src = first.match[1]
      if (src.startsWith("/uploads/") && !src.startsWith("http")) src = `${imgBase}${src}`
      arr.push(first.k === "iframe" ? { k: "map", src } : { k: "img", src })
      r = r.slice(first.idx + first.match[0].length).trim()
    }
  }
  const tail = r.trim()
  if (tail) arr.push({ k: "text", text: tail })
  return arr
}

function RenderHtml({ html, imgBase = "" }: { html: string; imgBase?: string }) {
  const blocks = extractBlocks(decodeHtmlEntities(html), imgBase)
  return (
    <>
      {blocks.map((b, i) => {
        if (b.k === "table") {
          const colCount = Math.max(...b.rows.map((r) => r.length))
          return (
            <View key={i} style={{ marginBottom: 6, borderWidth: 1, borderColor: hairline, borderRadius: 2 }}>
              {b.rows.map((row, ri) => (
                <View
                  key={ri}
                  style={{
                    flexDirection: "row",
                    backgroundColor: ri === 0 ? navy : "transparent",
                    borderBottomWidth: ri < b.rows.length - 1 ? 1 : 0,
                    borderBottomColor: hairline,
                  }}
                >
                  {Array.from({ length: colCount }).map((_, ci) => {
                    const cell = row[ci] ?? ""
                    return (
                      <View
                        key={ci}
                        style={{
                          flex: 1,
                          paddingHorizontal: 6,
                          paddingVertical: 5,
                          borderRightWidth: ci < colCount - 1 ? 1 : 0,
                          borderRightColor: hairline,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 8,
                            color: ri === 0 ? "#fff" : ink,
                            fontWeight: ri === 0 ? 700 : 400,
                          }}
                        >
                          {cell}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              ))}
            </View>
          )
        }
        if (b.k === "img") {
          return <Image key={i} src={b.src} style={{ width: "100%", height: 200, objectFit: "contain", marginBottom: 6 }} />
        }
        if (b.k === "map") {
          return (
            <View key={i} style={{ backgroundColor: "#f5f4ef", padding: 12, borderRadius: 4, marginBottom: 6 }}>
              <Text style={{ fontSize: 10, color: mute, textAlign: "center" }}>
                Map: {b.src}
              </Text>
            </View>
          )
        }
        const content = renderTextContent(b.text)
        if (content.length === 0) return null
        return <View key={i}>{content}</View>
      })}
    </>
  )
}

function LetterheadHeader({ title, logoUrl }: { title: string; logoUrl: string | null }) {
  return (
    <View style={styles.header} fixed>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        {logoUrl && <Image src={logoUrl} style={styles.headerLogo} />}
      </View>
      <View style={styles.headerLine} />
    </View>
  )
}

function LetterheadFooter({ address, phone }: { address: string; phone: string }) {
  return (
    <View style={styles.footer} fixed>
      <View style={styles.footerLine} />
      <Text style={styles.footerText}>{address}</Text>
      <Text style={styles.footerText}>{phone}</Text>
    </View>
  )
}

function TripContent({
  pkg,
  logoUrl,
  address,
  phone,
  apiBase,
}: {
  pkg: Activity
  logoUrl: string | null
  address: string
  phone: string
  apiBase: string
}) {
  return (
    <Page size="A4" style={styles.page} wrap>
      <LetterheadHeader title={pkg.title} logoUrl={logoUrl} />
      <LetterheadFooter address={address} phone={phone} />

      {/* ── Overview ── */}
      {pkg.shortDescription && (
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.sectionDivider} />
          <RenderHtml html={pkg.shortDescription} imgBase={apiBase} />
        </View>
      )}

      {/* ── Full Description ── */}
      {pkg.fullDescription && (
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.sectionDivider} />
          <RenderHtml html={pkg.fullDescription} imgBase={apiBase} />
        </View>
      )}

      {/* ── Highlights ── */}
      {pkg.highlights?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Highlights</Text>
          <View style={styles.sectionDivider} />
          <View style={{ marginBottom: 20 }}>
            {pkg.highlights.flatMap((h, i) =>
              extractLiItems(h).map((item, j) => (
                <View key={`${i}-${j}`} style={styles.highlightRow}>
                  <View style={styles.highlightBullet} />
                  <InlineText html={item} style={styles.highlightText} />
                </View>
              )),
            )}
          </View>
        </>
      )}

      {/* ── Facts ── */}
      <View style={styles.factsRow}>
        {pkg.bestSeason && (
          <View style={styles.factLine}>
            <Text style={styles.factLabel}>Best Season</Text>
            <Text style={styles.factValue}>{pkg.bestSeason}</Text>
          </View>
        )}
        {pkg.transportation && (
          <View style={styles.factLine}>
            <Text style={styles.factLabel}>Transport</Text>
            <Text style={styles.factValue}>{pkg.transportation}</Text>
          </View>
        )}
        {pkg.meals && (
          <View style={styles.factLine}>
            <Text style={styles.factLabel}>Meals</Text>
            <Text style={styles.factValue}>{pkg.meals}</Text>
          </View>
        )}
        {pkg.accommodations?.length > 0 && (
          <View style={styles.factLine}>
            <Text style={styles.factLabel}>Accommodation</Text>
            <Text style={styles.factValue}>{pkg.accommodations.join(", ")}</Text>
          </View>
        )}
        {pkg.duration && (
          <View style={styles.factLine}>
            <Text style={styles.factLabel}>Duration</Text>
            <Text style={styles.factValue}>{pkg.duration}</Text>
          </View>
        )}
        {pkg.difficultyLevel && (
          <View style={styles.factLine}>
            <Text style={styles.factLabel}>Difficulty</Text>
            <Text style={styles.factValue}>{pkg.difficultyLevel}</Text>
          </View>
        )}
        {pkg.maximumAltitude && (
          <View style={styles.factLine}>
            <Text style={styles.factLabel}>Max Altitude</Text>
            <Text style={styles.factValue}>{pkg.maximumAltitude}</Text>
          </View>
        )}
        {pkg.groupSize && (
          <View style={styles.factLine}>
            <Text style={styles.factLabel}>Group Size</Text>
            <Text style={styles.factValue}>{pkg.groupSize}</Text>
          </View>
        )}
      </View>

      {/* ── Map ── */}
      {pkg.map && (
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Map</Text>
          <View style={styles.sectionDivider} />
          <RenderHtml html={pkg.map} imgBase={apiBase} />
        </View>
      )}

      {/* ── Images ── */}
      {pkg.images?.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>Images</Text>
          <View style={styles.sectionDivider} />
          {pkg.images.map((img, i) => (
            <Image
              key={i}
              src={img.startsWith("/uploads/") ? `${apiBase}${img}` : img}
              style={{ width: "100%", height: 200, objectFit: "contain", marginBottom: 6 }}
            />
          ))}
        </View>
      )}

      {/* ── Itinerary ── */}
      {pkg.itinerary?.length > 0 &&
        pkg.itinerary.map((variant) => (
          <View key={variant.id} wrap={false}>
            {variant.name && (
              <Text style={styles.sectionTitle}>{variant.name}</Text>
            )}
            <View style={styles.sectionDivider} />
            <View style={{ marginBottom: 20 }}>
              {variant.days?.map((day) => (
                <View key={day.day} style={styles.dayCard} wrap={false}>
                  <Text style={styles.dayTitle}>{day.title}</Text>
                  {(day.duration || day.distance || day.ascent || day.descent) && (
                    <View style={styles.dayMeta}>
                      {day.duration && <Text style={styles.dayMetaText}>{day.duration}</Text>}
                      {day.distance && <Text style={styles.dayMetaText}>{day.distance}</Text>}
                      {day.ascent && <Text style={styles.dayMetaText}>A: {day.ascent}</Text>}
                      {day.descent && <Text style={styles.dayMetaText}>D: {day.descent}</Text>}
                    </View>
                  )}
                  <View style={styles.dayDesc}>
                    <RenderHtml html={day.description} imgBase={apiBase} />
                  </View>
                  {day.meals?.length > 0 && (
                    <Text style={[styles.dayMetaText, { marginTop: 2 }]}>
                      Meals: {day.meals.join(", ")}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

      {/* ── Inclusions ── */}
      {pkg.inclusions?.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>What&apos;s Included</Text>
          {pkg.inclusions.flatMap((item, i) =>
            extractLiItems(item).map((liContent, j) => (
              <View key={`${i}-${j}`} style={styles.listItem}>
                <Text style={styles.listDash}>-</Text>
                <InlineText html={liContent} style={styles.listItemText} />
              </View>
            )),
          )}
        </View>
      )}

      {/* ── Exclusions ── */}
      {pkg.exclusions?.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>What&apos;s Excluded</Text>
          {pkg.exclusions.flatMap((item, i) =>
            extractLiItems(item).map((liContent, j) => (
              <View key={`${i}-${j}`} style={styles.listItem}>
                <Text style={styles.listDash}>-</Text>
                <InlineText html={liContent} style={styles.listItemText} />
              </View>
            )),
          )}
        </View>
      )}

      {/* ── What to Bring ── */}
      {pkg.whatToBring?.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Packing List</Text>
          {pkg.whatToBring.flatMap((item, i) =>
            extractLiItems(item).map((liContent, j) => (
              <View key={`${i}-${j}`} style={styles.listItem}>
                <Text style={styles.listDash}>-</Text>
                <InlineText html={liContent} style={styles.listItemText} />
              </View>
            )),
          )}
        </View>
      )}

      {/* ── Additional Info ── */}
      {pkg.additionalInfo?.map((info, i) => (
        <View key={i}>
          <Text style={styles.addInfoTitle}>{info.title}</Text>
          <View style={styles.addInfoDesc}>
            <RenderHtml html={info.description} imgBase={apiBase} />
          </View>
        </View>
      ))}

      {/* ── FAQs ── */}
      {pkg.faqs?.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.sectionDivider} />
          {pkg.faqs.map((faq, i) => (
            <View key={i} style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 10, fontWeight: 700, color: navy, marginBottom: 2 }}>
                Q: {faq.question}
              </Text>
              <RenderHtml html={faq.answer} imgBase={apiBase} />
            </View>
          ))}
        </View>
      )}
    </Page>
  )
}

export function TripPDFDocument({
  pkg,
  logoUrl,
  address,
  phone,
  apiBase,
}: {
  pkg: Activity
  logoUrl: string | null
  address: string
  phone: string
  apiBase: string
}) {
  return (
    <Document>
      <TripContent
        pkg={pkg}
        logoUrl={logoUrl}
        address={address}
        phone={phone}
        apiBase={apiBase}
      />
    </Document>
  )
}
