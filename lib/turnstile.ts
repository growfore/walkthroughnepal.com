const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY
const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export async function verifyTurnstile(token: string): Promise<boolean> {
  if (process.env.TURNSTILE_DISABLED === "true") return true
  if (!TURNSTILE_SECRET) throw new Error("TURNSTILE_SECRET_KEY not configured")
  const res = await fetch(SITEVERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token }),
  })
  const data = await res.json()
  return data.success === true
}
