export const LOCALES = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
] as const

export type LocaleCode = (typeof LOCALES)[number]["code"]

export const LOCALE_CODES = LOCALES.map((l) => l.code)

export function isLocaleCode(value: string | undefined): value is LocaleCode {
  return !!value && LOCALE_CODES.includes(value as LocaleCode)
}

export function localeName(code: LocaleCode): string {
  return LOCALES.find((l) => l.code === code)?.name ?? "English"
}