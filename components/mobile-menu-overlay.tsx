"use client"

import { Dispatch, SetStateAction, useEffect } from "react"
import { MobileMenuItem } from "./mobile-menu-item"

type MenuItem = {
  id: string
  label: string
  url: string
  children: MenuItem[]
}

interface MobileMenuOverlayProps {
  items: MenuItem[]
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  onNavigate: () => void
}

export function MobileMenuOverlay({
  items,
  isOpen,
  setIsOpen,
  onNavigate,
}: MobileMenuOverlayProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-x-0 top-[100px] bottom-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[100px] bg-white border-b border-[#dee1e6] z-50 overflow-y-auto max-h-[calc(100vh-100px)]">
          {items.map((item) => (
            <MobileMenuItem key={item.id} item={item} onNavigate={onNavigate} />
          ))}
          <div className="flex gap-2 p-4 border-t border-[#dee1e6]">
            <a
              href="/design-your-trip"
              className="flex-1 rounded-full border border-[#dee1e6] px-5 py-2.5 text-sm font-semibold text-navy text-center"
            >
              Customize My Trip
            </a>
            <a
              href="/booking"
              className="flex-1 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-orange-foreground text-center"
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </>
  )
}
