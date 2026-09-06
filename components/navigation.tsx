import { cache } from "react"
import { MenuController } from "./menu-controller"
import { API_BASE } from "@/lib/api"
import { getI18n } from "@/lib/server-locale"

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

const fetchMenu = cache(async (locale: string) => {
  try {
    const res = await fetch(`${API_BASE}/api/v1/menu?locale=${encodeURIComponent(locale)}`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const data: MenuData = await res.json()
    return data?.data?.items ?? []
  } catch {
    return []
  }
})

export async function Navigation() {
  const { locale, t, href } = await getI18n()
  const items = await fetchMenu(locale)
  const localize = (item: MenuItem): MenuItem => ({
    ...item,
    label: locale === "en" ? t(item.label) : item.label,
    url: href(item.url),
    children: item.children.map(localize),
  })
  return <MenuController items={items.map(localize)} />
}
