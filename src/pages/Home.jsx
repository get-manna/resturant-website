import { motion } from "framer-motion"
import HeroSection from "@/components/home/HeroSection.jsx"
import PopularCategories from "@/components/home/PopularCategories.jsx"
import FeaturedProducts from "@/components/home/FeaturedProducts.jsx"
import BestSellers from "@/components/home/BestSellers.jsx"
import Testimonials from "@/components/home/Testimonials.jsx"
import CTASection from "@/components/home/CTASection.jsx"

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <HeroSection />
      <PopularCategories />
      <FeaturedProducts />
      <BestSellers />
      <Testimonials />
      <CTASection />
    </motion.div>
  )
}
