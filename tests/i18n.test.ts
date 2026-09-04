import test from "node:test"
import assert from "node:assert/strict"
import { getMessages, MESSAGE_ROWS } from "../lib/messages.ts"
import { localizedPath, LOCALES } from "../lib/locales.ts"
import { hasActivityLocaleSlug } from "../lib/api.ts"

test("all locales provide non-empty translations for every source string", () => {
  const sources = [...new Set(MESSAGE_ROWS.map(([source]) => source))]
  for (const { code } of LOCALES) {
    const messages = getMessages(code)
    assert.deepEqual(Object.keys(messages).sort(), sources.sort())
    for (const source of sources) assert.ok(messages[source], `${code} missing ${source}`)
  }
})

test("translation placeholders stay aligned", () => {
  const placeholders = (value: string) => value.match(/\{[^}]+\}/g)?.sort() ?? []
  const sources = [...new Set(MESSAGE_ROWS.map(([source]) => source))]
  for (const { code } of LOCALES) {
    const messages = getMessages(code)
    for (const source of sources) assert.deepEqual(placeholders(messages[source]), placeholders(source), `${code}: ${source}`)
  }
})

test("localized paths use stable base slugs", () => {
  assert.equal(localizedPath("/trip/everest-base-camp?x=1", "fr"), "/fr/trip/everest-base-camp?x=1")
  assert.equal(localizedPath("/fr/trip/everest-base-camp", "ja"), "/ja/trip/everest-base-camp")
  assert.equal(localizedPath("/fr/trip/everest-base-camp", "en"), "/trip/everest-base-camp")
  assert.equal(localizedPath("https://example.com", "fr"), "https://example.com")
})

test("only published locale slugs qualify as translated trips", () => {
  const alternates = [
    { locale: "en", slug: "everest-base-camp", updatedAt: null, auto: false, skipped: false },
    { locale: "de", slug: "everest-basislager", updatedAt: null, auto: false, skipped: false },
    { locale: "fr", slug: "camp-de-base-everest", updatedAt: null, auto: false, skipped: true },
  ]
  assert.ok(hasActivityLocaleSlug(alternates, "en", "everest-base-camp"))
  assert.ok(hasActivityLocaleSlug(alternates, "de", "everest-basislager"))
  assert.equal(hasActivityLocaleSlug(alternates, "de", "everest-base-camp"), false)
  assert.equal(hasActivityLocaleSlug(alternates, "fr", "camp-de-base-everest"), false)
})
