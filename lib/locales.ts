export const LOCALES = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "ja", name: "日本語" },
] as const

export type LocaleCode = (typeof LOCALES)[number]["code"]

export const LOCALE_CODES = LOCALES.map((l) => l.code)

export function isLocaleCode(value: string | undefined): value is LocaleCode {
  return !!value && LOCALE_CODES.includes(value as LocaleCode)
}

// lang tag (hreflang / og:locale territory form), e.g. "de-DE", "en-US"
export const LOCALE_TERRITORY: Record<LocaleCode, string> = {
  en: "en-US",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  it: "it-IT",
  pt: "pt-PT",
  ru: "ru-RU",
  ja: "ja-JP",
}

export function localeName(code: LocaleCode): string {
  return LOCALES.find((l) => l.code === code)?.name ?? "English"
}

const LOCALE_PREFIX_RE = /^\/(de|es|fr|it|pt|ru|ja)(?=\/|$)/

export function localizedPath(path: string, locale: LocaleCode): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path
  const base = path.replace(LOCALE_PREFIX_RE, "") || "/"
  if (locale === "en") return base
  return `/${locale}${base === "/" ? "/" : base}`
}
