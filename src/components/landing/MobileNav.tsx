
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { PremiumButton } from '../ui/premium/button';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Close the menu when switching to desktop view
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile, isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <button className="text-foreground hover:text-premium-gold transition-colors" aria-label="Toggle menu">
          <Menu size={24} />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-premium-dark-800 border-premium-dark-700 w-full max-w-xs p-0">
        <div className="flex flex-col h-full">
          <div className="px-4 py-4 border-b border-premium-dark-700/30 flex items-center justify-between">
            <span className="font-bold text-xl bg-gradient-gold bg-clip-text text-transparent">Investor Paisa</span>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X size={24} />
            </button>
          </div>
          <div className="px-4 py-6 flex flex-col gap-6">
            <Link 
              to="#vision" 
              className="text-lg text-foreground hover:text-premium-gold transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Vision
            </Link>
            <Link 
              to="#categories" 
              className="text-lg text-foreground hover:text-premium-gold transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Categories
            </Link>
            <Link 
              to="#segments" 
              className="text-lg text-foreground hover:text-premium-gold transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Who We Serve
            </Link>
            <div className="h-px bg-premium-dark-700/30 my-2"></div>
            <Link 
              to="/auth/login" 
              className="text-lg text-foreground hover:text-premium-gold transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
            <PremiumButton asChild onClick={() => setIsOpen(false)}>
              <Link to="/auth/register">
                Sign Up
              </Link>
            </PremiumButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
