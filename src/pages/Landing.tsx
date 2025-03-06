
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import PostsSection from '@/components/landing/PostsSection';
import PopularCommunitiesSection from '@/components/landing/PopularCommunitiesSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-premium">
      <Header />
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-6 px-4 py-6">
        <div className="w-full md:w-8/12">
          <HeroSection />
          <PostsSection />
        </div>
        <div className="w-full md:w-4/12 space-y-6">
          <PopularCommunitiesSection />
          <CtaSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
