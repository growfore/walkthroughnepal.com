import { cache } from "react"
import { MenuController } from "./menu-controller"

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

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

const fetchMenu = cache(async () => {
  try {
    const res = await fetch(`${API}/api/v1/menu`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const data: MenuData = await res.json()
    return data?.data?.items ?? []
  } catch {
    return []
  }
})

export async function Navigation() {
  const items = await fetchMenu()
  return <MenuController items={items} />
}
