
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="py-6 px-8 border-b border-premium-dark-700/30 backdrop-blur-sm bg-premium-dark-900/50 sticky top-0 z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl bg-gradient-gold bg-clip-text text-transparent">Investor Paisa</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="#vision" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Vision
          </Link>
          <Link to="#categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Categories
          </Link>
          <Link to="#segments" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Who We Serve
          </Link>
          <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link to="/auth/register" className="btn-premium text-sm py-2 px-4">
            Sign Up
          </Link>
        </nav>
        <div className="md:hidden flex items-center">
          <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground mr-4">
            Sign In
          </Link>
          <Link to="/auth/register" className="btn-premium text-sm py-2 px-4">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
