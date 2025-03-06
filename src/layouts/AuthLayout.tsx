
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="py-6 px-8 border-b border-black/5">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-gradient-gold bg-clip-text text-transparent">Investor Paisa</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-sm text-black/60 hover:text-black transition-colors">
              Home
            </Link>
            <Link to="/auth/login" className="text-sm text-black/60 hover:text-black transition-colors">
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
      <footer className="py-6 px-8 border-t border-black/5">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-black/60">
            © {new Date().getFullYear()} Investor Paisa. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-xs text-black/60 hover:text-black">Privacy Policy</Link>
            <Link to="#" className="text-xs text-black/60 hover:text-black">Terms of Service</Link>
            <Link to="#" className="text-xs flex items-center gap-1 text-gold">
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
