
import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';
import { PremiumButton } from '../ui/premium/button';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-3 px-4 border-b border-premium-dark-700/30 backdrop-blur-sm bg-premium-dark-900/50 sticky top-0 z-10">
      <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl bg-gradient-gold bg-clip-text text-transparent">Investor Paisa</span>
        </Link>
        
        {/* Search Bar */}
        <div className="hidden md:flex relative flex-1 max-w-md mx-4">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search Investor Paisa"
            className="w-full h-9 rounded-md bg-premium-dark-800/70 border border-premium-dark-700/50 px-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-premium-gold/50 focus:ring-1 focus:ring-premium-gold/30"
          />
        </div>

        <nav className="hidden md:flex items-center space-x-3">
          <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <PremiumButton asChild size="sm">
            <Link to="/auth/register">
              Sign Up
            </Link>
          </PremiumButton>
        </nav>
        
        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-4">
          <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
