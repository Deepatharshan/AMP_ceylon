import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Heritage from '@/components/Heritage';
import FeaturedProducts from '@/components/FeaturedProducts';
import CartonHero from '@/components/CartonHero';
import FeaturedCartons from '@/components/FeaturedCartons';
import ProcessAnimation from '@/components/ProcessAnimation';
import StatsSection from '@/components/StatsSection';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main style={{ width: '100%', overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <Heritage />
      <StatsSection />
      
      {/* Floral Business */}
      <FeaturedProducts />
      
      {/* Carton Business */}
      <CartonHero />
      <FeaturedCartons />
      
      <ProcessAnimation />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
