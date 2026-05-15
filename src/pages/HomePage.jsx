import HeroBanner       from '@/components/sections/HeroBanner'
import BrandGrid        from '@/components/sections/BrandGrid'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import DropsTeaser      from '@/components/sections/DropsTeaser'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <BrandGrid />
      <FeaturedProducts
        titleKey="home.new_arrivals"
        labelKey="common.new"
        filter={p => p.badge === 'NEW'}
        viewAllTo="/shop?badge=NEW"
        accent="#0066FF"
      />
      <DropsTeaser />
      <FeaturedProducts
        titleKey="home.bestsellers"
        labelKey="common.bestseller"
        filter={p => p.badge === 'BESTSELLER'}
        viewAllTo="/shop?badge=BESTSELLER"
        accent="#FF2D78"
      />
      <FeaturedProducts
        titleKey="home.sale_section"
        labelKey="common.sale"
        filter={p => p.badge === 'SALE'}
        viewAllTo="/shop?badge=SALE"
        accent="#FF2D78"
      />
    </>
  )
}
