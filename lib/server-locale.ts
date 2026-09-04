import { headers } from "next/headers"
import { getMessages, formatMessage } from "./messages"
import { isLocaleCode, localizedPath } from "./locales"

export async function getI18n() {
  const value = (await headers()).get("x-locale") ?? undefined
  const locale = isLocaleCode(value) ? value : "en"
  const messages = getMessages(locale)
  return {
    locale,
    messages,
    t: (source: string, values?: Record<string, string | number>) => formatMessage(messages, source, values),
    href: (path: string) => localizedPath(path, locale),
  }
}
