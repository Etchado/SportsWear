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
        filter={p => p.badge === 'NEW'}
        viewAllTo="/shop?badge=NEW"
        accent="#0066FF"
      />
      <DropsTeaser />
      <FeaturedProducts
        title="Bestsellers"
        filter={p => p.badge === 'BESTSELLER'}
        viewAllTo="/shop?badge=BESTSELLER"
        accent="#FF2D78"
      />
      <FeaturedProducts
        title="Sale — Up to 30% Off"
        filter={p => p.badge === 'SALE'}
        viewAllTo="/shop?badge=SALE"
        accent="#FF2D78"
      />
    </>
  )
}
