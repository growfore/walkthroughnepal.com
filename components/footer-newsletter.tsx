"use client"

import { Loader2 } from "lucide-react"
import { useState, FormEvent } from "react"
import { Turnstile, getTurnstileToken } from "@/components/turnstile"

export function FooterNewsletter() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("loading")
    const form = e.currentTarget
    const email = new FormData(form).get("email") as string
    const token = getTurnstileToken(form)
    if (!token) {
      setStatus("error")
      setMessage("Please complete the verification")
      return
    }
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, "cf-turnstile-response": token }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus("success")
        setMessage("Thanks for subscribing!")
        form.reset()
      } else {
        setStatus("error")
        setMessage(data.error || data.message || "Something went wrong")
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Please try again.")
    }
  }

  return (
    <div className="border-y border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="sm:flex-1">
            <h3 className="text-xl font-bold">Subscribe to our newsletter</h3>
            <p className="mt-1 text-sm text-white/60">
              Get the latest trek updates and travel tips straight to your
              inbox.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md flex-col gap-3"
          >
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                aria-label="Email address for newsletter"
                className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-orange focus:ring-1 focus:ring-orange disabled:opacity-50"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="shrink-0 rounded-lg bg-orange px-5 py-2.5 text-sm font-semibold text-orange-foreground transition-colors hover:bg-orange/90 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
            <Turnstile theme="dark" />
          </form>
        </div>
        {status === "success" && (
          <p className="mt-3 text-center text-sm text-green-400 sm:text-left">
            {message}
          </p>
        )}
        {status === "error" && (
          <p className="mt-3 text-center text-sm text-red-400 sm:text-left">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
