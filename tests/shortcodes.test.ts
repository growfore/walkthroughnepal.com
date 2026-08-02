import { test } from "node:test"
import assert from "node:assert/strict"
import { parseShortcodes } from "../lib/shortcodes.ts"

test("parses text-form trip shortcode", () => {
  const segs = parseShortcodes('<p>Intro</p><p>[trip slug="everest-base-camp-trek"]</p><p>Outro</p>')
  assert.deepEqual(segs, [
    { type: "html", html: "<p>Intro</p><p>" },
    { type: "trip", slug: "everest-base-camp-trek" },
    { type: "html", html: "</p><p>Outro</p>" },
  ])
})

test("parses text-form featured shortcode with default count", () => {
  const segs = parseShortcodes('[featured-trips tag="top-rated"]')
  assert.deepEqual(segs, [{ type: "featured", tag: "top-rated", count: 4 }])
})

test("parses featured with explicit and clamped count", () => {
  assert.deepEqual(parseShortcodes('[featured-trips tag="x" count="2"]'), [
    { type: "featured", tag: "x", count: 2 },
  ])
  assert.deepEqual(parseShortcodes('[featured-trips tag="x" count="999"]'), [
    { type: "featured", tag: "x", count: 12 },
  ])
  assert.deepEqual(parseShortcodes('[featured-trips tag="x" count="nope"]'), [
    { type: "featured", tag: "x", count: 4 },
  ])
})

test("parses single-quoted and unquoted attrs", () => {
  assert.deepEqual(parseShortcodes(`[post slug='annapurna-base-camp-trek']`), [
    { type: "post", slug: "annapurna-base-camp-trek" },
  ])
  assert.deepEqual(parseShortcodes("[trip slug=everest-base-camp-trek]"), [
    { type: "trip", slug: "everest-base-camp-trek" },
  ])
})

test("consumes CMS editor element form whole", () => {
  const html = '<p data-shortcode="post" data-slug="some-post">[post slug="some-post"]</p>'
  assert.deepEqual(parseShortcodes(html), [{ type: "post", slug: "some-post" }])
})

test("passes through plain html", () => {
  const html = "<p>Hello <strong>world</strong></p>"
  assert.deepEqual(parseShortcodes(html), [{ type: "html", html }])
})

test("drops malformed shortcodes", () => {
  assert.deepEqual(parseShortcodes("[trip]"), [])
  assert.deepEqual(parseShortcodes('[featured-trips count="3"]'), [])
  assert.deepEqual(parseShortcodes("[unknown-slug]"), [{ type: "html", html: "[unknown-slug]" }])
})
