import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Heritage from '@/components/Heritage';
import FeaturedProducts from '@/components/FeaturedProducts';
import Curation from '@/components/Curation';
import ProcessAnimation from '@/components/ProcessAnimation';
import StatsSection from '@/components/StatsSection';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import HeroScrollAnimation from '@/components/ui/hero-scroll-animation';

export default function Home() {
  return (
    <main style={{ width: '100%', overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <HeroScrollAnimation />
      <Heritage />
      <StatsSection />
      <FeaturedProducts />
      <Curation />
      <ProcessAnimation />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
