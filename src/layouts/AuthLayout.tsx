
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-cred-dark">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthLayout;
