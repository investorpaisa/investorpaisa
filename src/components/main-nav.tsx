
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Search, User, Menu, Sparkles, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export const MainNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.nav 
      className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-50"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-heading font-bold text-white">
            Investor<span className="text-gold">Paisa</span>
          </span>
        </motion.div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search stocks, users, circles..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.button
            className="relative p-2 rounded-xl hover:bg-white/5 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="h-5 w-5 text-white/70" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full"></span>
          </motion.button>

          {/* Profile Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-xl hover:bg-white/5 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold/80 flex items-center justify-center">
                  <User className="w-4 h-4 text-black" />
                </div>
              )}
              <span className="hidden md:block text-white/80 font-medium">
                {profile?.full_name || profile?.username || 'User'}
              </span>
            </motion.button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <motion.div
                className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors duration-200"
                  onClick={() => setShowProfileMenu(false)}
                >
                  View Profile
                </Link>
                <Link
                  to="/edit-profile"
                  className="block px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors duration-200"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Edit Profile
                </Link>
                <hr className="border-white/10" />
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </div>

          {/* Mobile menu */}
          <motion.button
            className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="h-5 w-5 text-white/70" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};
