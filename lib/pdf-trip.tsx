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

Font.register({
  family: "Inter",
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

const styles = StyleSheet.create({
  page: {
    paddingTop: 100,
    paddingBottom: 80,
    paddingLeft: 50,
    paddingRight: 50,
    fontFamily: "Inter",
    fontSize: 10,
    color: ink,
    lineHeight: 1.6,
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
    fontSize: 16,
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
    marginTop: 8,
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
    marginBottom: 8,
  },
  footerText: {
    fontSize: 8,
    color: mute,
    textAlign: "left",
  },

  // ── Section ──
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: navy,
    marginBottom: 8,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: orange,
    width: 40,
    marginBottom: 12,
  },

  // ── Itinerary ──
  dayCard: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: hairline,
    borderRadius: 4,
    padding: 10,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  dayBadge: {
    backgroundColor: orange,
    color: "#fff",
    fontSize: 9,
    fontWeight: 700,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  dayTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: navy,
    flex: 1,
  },
  dayMeta: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  dayMetaText: {
    fontSize: 8,
    color: mute,
  },
  dayDesc: {
    fontSize: 9,
    color: ink,
    lineHeight: 1.65,
  },

  // ── Lists ──
  listSection: {
    marginBottom: 14,
  },
  listTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: navy,
    marginBottom: 6,
  },
  listItem: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 3,
    alignItems: "flex-start",
  },
  bullet: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 2,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  bulletCheck: { backgroundColor: "#16a34a" },
  bulletX: { backgroundColor: "#dc2626" },
  bulletBag: { backgroundColor: navy },
  bulletText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: 700,
  },
  listItemText: {
    fontSize: 9,
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  factPill: {
    backgroundColor: "#f5f4ef",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  factPillLabel: {
    fontSize: 7,
    color: mute,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  factPillValue: {
    fontSize: 10,
    fontWeight: 700,
    color: navy,
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
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
}: {
  pkg: Activity
  logoUrl: string | null
  address: string
  phone: string
}) {
  return (
    <Page size="A4" style={styles.page} wrap>
      <LetterheadHeader title={pkg.title} logoUrl={logoUrl} />
      <LetterheadFooter address={address} phone={phone} />

      {/* ── Highlights ── */}
      {pkg.highlights?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Highlights</Text>
          <View style={styles.sectionDivider} />
          <View style={{ marginBottom: 20 }}>
            {pkg.highlights.map((h, i) => (
              <View key={i} style={styles.highlightRow}>
                <View style={styles.highlightBullet} />
                <Text style={styles.highlightText}>{stripHtml(h)}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* ── Facts ── */}
      <View style={styles.factsRow}>
        {pkg.bestSeason && (
          <View style={styles.factPill}>
            <Text style={styles.factPillLabel}>Best Season</Text>
            <Text style={styles.factPillValue}>{pkg.bestSeason}</Text>
          </View>
        )}
        {pkg.transportation && (
          <View style={styles.factPill}>
            <Text style={styles.factPillLabel}>Transport</Text>
            <Text style={styles.factPillValue}>{pkg.transportation}</Text>
          </View>
        )}
        {pkg.meals && (
          <View style={styles.factPill}>
            <Text style={styles.factPillLabel}>Meals</Text>
            <Text style={styles.factPillValue}>{pkg.meals}</Text>
          </View>
        )}
        {pkg.accommodations?.length > 0 && (
          <View style={styles.factPill}>
            <Text style={styles.factPillLabel}>Accommodation</Text>
            <Text style={styles.factPillValue}>{pkg.accommodations.join(", ")}</Text>
          </View>
        )}
        {pkg.duration && (
          <View style={styles.factPill}>
            <Text style={styles.factPillLabel}>Duration</Text>
            <Text style={styles.factPillValue}>{pkg.duration}</Text>
          </View>
        )}
        {pkg.difficultyLevel && (
          <View style={styles.factPill}>
            <Text style={styles.factPillLabel}>Difficulty</Text>
            <Text style={styles.factPillValue}>{pkg.difficultyLevel}</Text>
          </View>
        )}
        {pkg.maximumAltitude && (
          <View style={styles.factPill}>
            <Text style={styles.factPillLabel}>Max Altitude</Text>
            <Text style={styles.factPillValue}>{pkg.maximumAltitude}</Text>
          </View>
        )}
        {pkg.groupSize && (
          <View style={styles.factPill}>
            <Text style={styles.factPillLabel}>Group Size</Text>
            <Text style={styles.factPillValue}>{pkg.groupSize}</Text>
          </View>
        )}
      </View>

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
                  <View style={styles.dayHeader}>
                    <View style={styles.dayBadge}>
                      <Text>DAY {day.day}</Text>
                    </View>
                    <Text style={styles.dayTitle}>{day.title}</Text>
                  </View>
                  {(day.duration || day.distance || day.ascent || day.descent) && (
                    <View style={styles.dayMeta}>
                      {day.duration && <Text style={styles.dayMetaText}>{day.duration}</Text>}
                      {day.distance && <Text style={styles.dayMetaText}>{day.distance}</Text>}
                      {day.ascent && <Text style={styles.dayMetaText}>A: {day.ascent}</Text>}
                      {day.descent && <Text style={styles.dayMetaText}>D: {day.descent}</Text>}
                    </View>
                  )}
                  <Text style={styles.dayDesc}>{stripHtml(day.description)}</Text>
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
          {pkg.inclusions.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <View style={[styles.bullet, styles.bulletCheck]}>
                <Text style={styles.bulletText}>✓</Text>
              </View>
              <Text style={styles.listItemText}>{stripHtml(item)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ── Exclusions ── */}
      {pkg.exclusions?.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>What&apos;s Excluded</Text>
          {pkg.exclusions.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <View style={[styles.bullet, styles.bulletX]}>
                <Text style={styles.bulletText}>✗</Text>
              </View>
              <Text style={styles.listItemText}>{stripHtml(item)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ── What to Bring ── */}
      {pkg.whatToBring?.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Packing List</Text>
          {pkg.whatToBring.map((item, i) => (
            <View key={i} style={styles.listItem}>
              <View style={[styles.bullet, styles.bulletBag]}>
                <Text style={styles.bulletText}>●</Text>
              </View>
              <Text style={styles.listItemText}>{stripHtml(item)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ── Additional Info ── */}
      {pkg.additionalInfo?.map((info, i) => (
        <View key={i}>
          <Text style={styles.addInfoTitle}>{info.title}</Text>
          <Text style={styles.addInfoDesc}>{stripHtml(info.description)}</Text>
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
              <Text style={{ fontSize: 9, color: ink, lineHeight: 1.6 }}>
                {stripHtml(faq.answer)}
              </Text>
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
}: {
  pkg: Activity
  logoUrl: string | null
  address: string
  phone: string
}) {
  return (
    <Document>
      <TripContent
        pkg={pkg}
        logoUrl={logoUrl}
        address={address}
        phone={phone}
      />
    </Document>
  )
}
