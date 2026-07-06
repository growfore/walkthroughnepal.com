"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Mail, Phone, ChevronDown, LucidePlus } from "lucide-react"
import { MobileMenuOverlay } from "./mobile-menu-overlay"

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
}

export function MenuController({ items }: MenuControllerProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const pathname = usePathname()
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLElement>(null)

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
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setIsVisible(y <= 80 || y < lastY)
      lastY = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setActiveMega(null)
    setIsMobileOpen(false)
  }, [pathname])

  const [activeSidebar, setActiveSidebar] = useState<string | null>(null)

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
      className={`fixed inset-x-0 top-0 z-50 border-b border-[#dee1e6] bg-white transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Top bar */}
      <div className="hidden bg-navy text-navy-foreground md:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm font-medium">
              <span className="flex text-orange">★★★★★</span>
              <span>
                4.9 <span className="text-navy-foreground/60">·</span> 2,800+
                reviews
              </span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="tel:+9779841234567"
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-orange"
            >
              <Phone className="h-4 w-4" /> +977 984 123 4567
            </a>
            <a
              href="mailto:info@walkthroughnepal.com"
              className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-orange"
            >
              <Mail className="h-4 w-4" /> info@walkthroughnepal.com
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8"
        onMouseLeave={queueHide}
      >
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="p-8 pl-0 font-black">
            <img
              src="/logo-jul-6.png"
              alt="Walk Through Nepal"
              className="h-auto w-36"
            />
          </Link>
        </div>
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
                  }
                }}
              >
                {itemHasChildren ? (
                  <button
                    aria-haspopup="true"
                    aria-expanded={isActive}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#f7f7f7] text-navy"
                        : "text-[#5b616e] hover:bg-[#f7f7f7] hover:text-navy"
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={16} className="text-[#a8acb3]" />
                  </button>
                ) : (
                  <Link
                    href={item.url || "#"}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-[#5b616e] transition-colors hover:bg-[#f7f7f7] hover:text-navy"
                  >
                    {item.label}
                  </Link>
                )}
                {itemHasChildren && !itemHasGrandchildren && isActive && (
                  <div
                    onMouseEnter={cancelHide}
                    className="absolute top-full left-0 z-40 pt-1"
                  >
                    <div className="max-w-[320px] min-w-[220px] rounded-xl border border-[#dee1e6] bg-white py-2 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url || "#"}
                          className="block px-5 py-2.5 text-sm text-[#5b616e] transition-colors hover:bg-[#f7f7f7] hover:text-navy"
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
              href="/design-your-trip"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#dee1e6] px-5 py-2 text-sm font-semibold text-navy transition hover:bg-[#f7f7f7]"
            >
              <LucidePlus className="size-4" />
              Customize My Trip
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center rounded-full bg-orange px-5 py-2 text-sm font-semibold text-orange-foreground transition hover:opacity-90"
            >
              Book Now
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
            className="pointer-events-none absolute inset-x-0 top-0 z-40 max-lg:hidden"
          >
            <div className="h-16" aria-hidden="true" />
            <div className="pointer-events-auto rounded-xl border border-[#dee1e6] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
              <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="flex">
                  <div className="w-[240px] shrink-0 border-r border-[#dee1e6] py-6 pr-6">
                    <ul className="space-y-1">
                      {activeMegaChildren.map((child) => {
                        const isActiveSidebar =
                          child.id === activeSidebarItem?.id
                        return (
                          <li key={child.id}>
                            <button
                              onMouseEnter={() => setActiveSidebar(child.id)}
                              className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                                isActiveSidebar
                                  ? "border-l-2 border-orange bg-[#f7f7f7] text-orange"
                                  : "border-l-2 border-transparent text-[#5b616e] hover:bg-[#f7f7f7] hover:text-navy"
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
                            className="block py-2 text-sm text-[#5b616e] transition-colors hover:text-navy"
                          >
                            {subChild.label}
                          </Link>
                        ))}
                      </div>
                    ) : activeSidebarItem ? (
                      <Link
                        href={activeSidebarItem.url || "#"}
                        className="text-[#5b616e] transition-colors hover:text-navy"
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
      />
    </nav>
  )
}
