import { LOCALE_TERRITORY, type LocaleCode } from "./locales"
import { getActivityAlternates } from "./api"

export const SITE_URL = "https://walkthroughnepal.com"

/**
 * Build hreflang `alternates.languages` from the backend per-locale slug payload,
 * mirroring Bookatrekking's tag set: one alternate per localized slug + x-default.
 * Locales with no translated slug are skipped (their page isn't localized yet).
 * Each page is self-canonical; English remains the x-default URL.
 */
export async function buildTripAlternates(
  id: number,
  locale: LocaleCode,
  slug: string,
): Promise<{ languages: Record<string, string>; canonical: string }> {
  const self = locale === "en" ? `/trip/${slug}` : `/${locale}/trip/${slug}`
  try {
    const { data } = await getActivityAlternates(id)
    const languages: Record<string, string> = {}
    for (const alt of data) {
      if (!alt.slug || alt.skipped) continue
      const tag = LOCALE_TERRITORY[alt.locale as LocaleCode]
      if (!tag) continue
      languages[tag] = alt.locale === "en" ? `/trip/${alt.slug}` : `/${alt.locale}/trip/${alt.slug}`
    }
    const english = languages[LOCALE_TERRITORY.en]
    const canonical = languages[LOCALE_TERRITORY[locale]] ?? english
    if (!canonical) return { languages: {}, canonical: self }
    languages["x-default"] = english ?? canonical
    return { languages, canonical }
  } catch {
    return { languages: {}, canonical: self }
  }
}
