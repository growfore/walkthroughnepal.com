"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Mail, Phone, ChevronDown } from "lucide-react"
import { MobileMenuOverlay } from "./mobile-menu-overlay"
import { SearchDialog } from "./search-dialog"
import { siteConfig } from "@/lib/siteConfig"
import { Logo } from "./logo"
import type { LocaleCode } from "@/lib/locales"

type MenuItem = {
  id: string
  label: string
  url: string
  children: MenuItem[]
}

const hasChildren = (item: MenuItem) =>
  Array.isArray(item.children) && item.children.length > 0

const hasGrandchildren = (item: MenuItem) =>
  hasChildren(item) && item.children.some((c) => hasChildren(c))

interface MenuControllerProps {
  items: MenuItem[]
  locale?: LocaleCode
}

export function MenuController({ items, locale = "en" }: MenuControllerProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const pathname = usePathname()
  const isTripPage = pathname.startsWith("/trip/")
  const navRef = useRef<HTMLElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
  }, [])

  const queueHide = useCallback(() => {
    cancelHide()
    hideTimer.current = setTimeout(() => setActiveMega(null), 200)
  }, [cancelHide])

  const closeMega = useCallback(() => setActiveMega(null), [])

  const openMega = useCallback(
    (id: string) => {
      cancelHide()
      setActiveMega(id)
    },
    [cancelHide]
  )

  const [activeSidebar, setActiveSidebar] = useState<string | null>(null)

  useEffect(() => {
    cancelHide()
    return cancelHide
  }, [cancelHide])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMega()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [closeMega])

  useEffect(() => {
    setActiveMega(null)
    setIsMobileOpen(false)
  }, [pathname])

  const activeMegaItem = activeMega
    ? items.find((i) => i.id === activeMega)
    : null
  const activeMegaChildren = activeMegaItem?.children ?? []
  const hasActiveGrandchildren = activeMegaItem
    ? hasGrandchildren(activeMegaItem)
    : false

  const activeSidebarItem = activeSidebar
    ? activeMegaChildren.find((c) => c.id === activeSidebar)
    : (activeMegaChildren[0] ?? null)

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
          className={`${isTripPage ? "relative w-full" : "fixed inset-x-0 top-0"} z-50 border-b border-border bg-white/40 backdrop-blur-xl`}
    >
      {/* Top bar */}
      <div className="hidden bg-navy text-navy-foreground md:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 md:px-5">
          <div>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-orange"
            >
              <Mail className="h-4 w-4" /> {siteConfig.email}
            </a>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${siteConfig.phoneNumbers[0].tel ?? siteConfig.whatsAppNumber}`}
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-orange"
            >
              <Phone className="h-4 w-4" /> {siteConfig.phoneNumbers[0].phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-2 md:gap-4 md:px-8"
        onMouseLeave={queueHide}
      >
        <Logo/>
        <div className="flex items-center gap-4">
          {items.map((item) => {
            const itemHasChildren = hasChildren(item)
            const itemHasGrandchildren = hasGrandchildren(item)
            const isActive = activeMega === item.id
            return (
              <div
                key={item.id}
                className="relative max-lg:hidden"
                onMouseEnter={() => {
                  if (itemHasChildren) {
                    openMega(item.id)
                    setActiveSidebar(null)
                  } else {
                    closeMega()
                  }
                }}
              >
                {itemHasChildren ? (
                  <button
                    aria-haspopup="true"
                    aria-expanded={isActive}
                    className={`text-lg inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                      isActive
                        ? "bg-muted text-navy"
                        : "text-navy hover:bg-muted"
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </button>
                ) : (
                  <Link
                    href={item.url || "#"}
                    className="text-lg inline-flex items-center rounded-lg px-3 py-1.5 font-semibold text-navy transition-colors hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                )}
                {itemHasChildren && !itemHasGrandchildren && isActive && (
                  <div
                    onMouseEnter={cancelHide}
                    className="absolute top-full left-0 z-[100] pt-1"
                  >
                    <div className="min-w-[220px] max-w-[320px] rounded-xl border border-border bg-white/40 py-2 shadow-lg backdrop-blur-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url || "#"}
                          className="block px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/inquiry"
              className="inline-flex items-center rounded-full bg-orange px-5 py-2 text-sm font-semibold text-orange-foreground transition hover:opacity-90 uppercase"
            >
              Inquire Now
            </Link>
          </div>
          <button
            className="p-2 lg:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          >
            {isMobileOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>

        {/* Mega menu dropdown (grandchildren only) */}
        {activeMegaItem && hasActiveGrandchildren && (
          <div
            onMouseEnter={cancelHide}
            className="pointer-events-none absolute inset-x-0 top-2 z-[100] max-lg:hidden border-t-0"
          >
            <div className="h-16" aria-hidden="true" />
            <div className="pointer-events-auto rounded-none border border-border bg-white backdrop-blur-xl shadow-[0_16px_24px_-12px_rgb(0_0_0/0.2)]">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="flex">
                  <div className="w-[240px] shrink-0 border-r border-border py-6 pr-6">
                    <ul className="space-y-1">
                      {activeMegaChildren.map((child) => {
                        const isActiveSidebar =
                          child.id === activeSidebarItem?.id
                        return (
                          <li key={child.id}>
                            <button
                              onMouseEnter={() => setActiveSidebar(child.id)}
                              className={`w-full rounded-none px-4 py-3 text-left text-sm font-medium transition-colors ${
                                isActiveSidebar
                                  ? "border-l-2 border-orange bg-muted text-orange rounded-none"
                                  : "border-l-2 border-transparent text-muted-foreground hover:bg-muted hover:text-navy"
                              }`}
                            >
                              {child.label}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <div className="min-w-0 flex-1 py-6 pl-8">
                    {activeSidebarItem && hasChildren(activeSidebarItem) ? (
                      <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                        {activeSidebarItem.children.map((subChild) => (
                          <Link
                            key={subChild.id}
                            href={subChild.url || "#"}
                            className="block py-2 text-sm text-muted-foreground transition-colors border-l border-l-transparent w-fit hover:bg-muted hover:border-orange p-4 hover:text-navy"
                          >
                            {subChild.label}
                          </Link>
                        ))}
                      </div>
                    ) : activeSidebarItem ? (
                      <Link
                        href={activeSidebarItem.url || "#"}
                        className="text-muted-foreground transition-colors hover:text-navy"
                      >
                        {activeSidebarItem.label}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      <MobileMenuOverlay
        items={items}
        isOpen={isMobileOpen}
        setIsOpen={setIsMobileOpen}
        onNavigate={() => setIsMobileOpen(false)}
        locale={locale}
      />
    </nav>
  )
}
