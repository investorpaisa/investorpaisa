
import { useEffect, useRef } from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import PostsSection from '@/components/landing/PostsSection';
import PopularCommunitiesSection from '@/components/landing/PopularCommunitiesSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

const Landing = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-premium overflow-hidden">
      {/* Improved visibility for background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(223,189,105,0.2),transparent_80%)]"></div>
      
      <Header />
      
      <div 
        ref={(el) => (sectionRefs.current[0] = el)} 
        className="opacity-0 transform translate-y-4 transition-all duration-700"
      >
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-6 px-4 py-6">
          <div className="w-full md:w-8/12">
            <HeroSection />
            <div 
              ref={(el) => (sectionRefs.current[1] = el)} 
              className="opacity-0 transform translate-y-4 transition-all duration-700 delay-300"
            >
              <PostsSection />
            </div>
          </div>
          <div className="w-full md:w-4/12 space-y-6">
            <div 
              ref={(el) => (sectionRefs.current[2] = el)} 
              className="opacity-0 transform translate-y-4 transition-all duration-700 delay-500"
            >
              <PopularCommunitiesSection />
            </div>
            <div 
              ref={(el) => (sectionRefs.current[3] = el)} 
              className="opacity-0 transform translate-y-4 transition-all duration-700 delay-700"
            >
              <CtaSection />
            </div>
          </div>
        </div>
      </div>
      
      <div 
        ref={(el) => (sectionRefs.current[4] = el)}
        className="opacity-0 transform translate-y-4 transition-all duration-700 delay-900 mt-auto"
      >
        <Footer />
      </div>
      
      {/* Enhanced visibility for premium floating elements */}
      <div className="fixed pointer-events-none inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-premium-gold/10 blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/4 -right-20 w-60 h-60 rounded-full bg-premium-gold/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -left-10 w-32 h-32 rounded-full bg-premium-gold/10 blur-3xl animate-float-reverse"></div>
      </div>
    </div>
  );
};

export default Landing;
