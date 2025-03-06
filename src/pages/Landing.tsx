
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import VisionSection from '@/components/landing/VisionSection';
import CategoriesSection from '@/components/landing/CategoriesSection';
import SegmentsSection from '@/components/landing/SegmentsSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-premium">
      <Header />
      <HeroSection />
      <VisionSection />
      <CategoriesSection />
      <SegmentsSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Landing;
