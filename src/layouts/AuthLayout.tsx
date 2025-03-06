
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-premium">
      <header className="py-6 px-8 border-b border-premium-dark-700/30">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-gradient-gold bg-clip-text text-transparent">Investor Paisa</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link to="/auth/register" className="btn-premium text-sm py-2 px-4">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      <footer className="py-6 px-8 border-t border-premium-dark-700/30">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Investor Paisa. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-xs text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link to="#" className="text-xs text-muted-foreground hover:text-foreground">Terms of Service</Link>
            <Link to="#" className="text-xs flex items-center gap-1 text-premium-gold">
              <Sparkles className="h-3 w-3" />
              Premium
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
