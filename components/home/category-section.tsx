import { CategoryScroll } from "@/components/category-scroll"
import { ScrollButtons } from "@/components/scroll-buttons"
import { SectionHeader } from "@/components/section-header"
import type { HomeCategory } from "@/lib/home-data"

export function CategorySection({ categories }: { categories: HomeCategory[] }) {
  return (
    <section className="mt-12 pb-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          title="Explore by Category"
          rightAction={<ScrollButtons targetId="category-scroll" />}
        />
        <CategoryScroll categories={categories} id="category-scroll" />
      </div>
    </section>
  )
}
