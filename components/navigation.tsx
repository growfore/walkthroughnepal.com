import { cache } from "react"
import { headers } from "next/headers"
import { MenuController } from "./menu-controller"
import { API_BASE } from "@/lib/api"
import { isLocaleCode } from "@/lib/locales"

type MenuItem = {
  id: string
  label: string
  url: string
  children: MenuItem[]
}

type MenuData = {
  success: boolean
  data: {
    items: MenuItem[]
  }
}

const fetchMenu = cache(async () => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/menu`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const data: MenuData = await res.json()
    return data?.data?.items ?? []
  } catch {
    return []
  }
})

export async function Navigation() {
  const items = await fetchMenu()
  const headersList = await headers()
  const locale = headersList.get("x-locale") ?? "en"
  return <MenuController items={items} locale={isLocaleCode(locale) ? locale : "en"} />
}
