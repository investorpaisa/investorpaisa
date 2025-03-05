
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-8 border-b">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-ip-blue">Investor Paisa</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link to="/auth/register" className="text-sm bg-ip-teal text-white px-4 py-2 rounded-md hover:bg-ip-teal-600 transition-colors">
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
      <footer className="py-6 px-8 border-t">
        <div className="max-w-7xl mx-auto w-full text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Investor Paisa. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
