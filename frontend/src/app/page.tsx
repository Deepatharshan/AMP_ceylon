import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Heritage from '@/components/Heritage';
import Curation from '@/components/Curation';
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
      <Curation />
      <ProcessAnimation />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
