import { test } from "node:test"
import assert from "node:assert/strict"
import { parseRichList } from "../lib/forms.ts"

test("splits intro prose and list items in order", () => {
  assert.deepEqual(parseRichList("<p>Pack these</p><ul><li>Warm jacket</li><li>Boots</li></ul><p>Then buy locally.</p>"), [
    { type: "prose", html: "<p>Pack these</p>" },
    { type: "item", html: "Warm jacket" },
    { type: "item", html: "Boots" },
    { type: "prose", html: "<p>Then buy locally.</p>" },
  ])
})

test("handles prose-only and list-only input", () => {
  assert.deepEqual(parseRichList("<p>Just prose</p>"), [{ type: "prose", html: "<p>Just prose</p>" }])
  assert.deepEqual(parseRichList("<ol><li>One</li><li>Two</li></ol>"), [
    { type: "item", html: "One" },
    { type: "item", html: "Two" },
  ])
})

test("multiple lists each contribute items", () => {
  const segs = parseRichList("<ul><li>A</li></ul><p>between</p><ul><li>B</li></ul>")
  assert.deepEqual(segs, [
    { type: "item", html: "A" },
    { type: "prose", html: "<p>between</p>" },
    { type: "item", html: "B" },
  ])
})
