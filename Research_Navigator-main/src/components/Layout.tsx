import React, { useState } from 'react';
import { Menu, X, Settings, History, FolderOpen, LogOut, Home } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const menuVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  };

  const menuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    })
  };

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/tagged', icon: FolderOpen, label: 'Tagged Pages' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <motion.nav
        initial={false}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="px-4 text-gray-600 dark:text-gray-200 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
              <motion.button
                onClick={() => handleNavigation('/')}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 flex items-center"
              >
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ResearchNavigator
                </span>
              </motion.button>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => handleNavigation('/')}
                whileHover={{ scale: 1.05 }}
                className="text-gray-600 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <Home className="h-6 w-6" />
              </motion.button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 overflow-y-auto z-50 shadow-xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-semibold text-green-600 dark:text-green-400">
                  Menu
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>
              <nav className="space-y-4">
                {menuItems.map((item, i) => (
                  <motion.button
                    key={item.path}
                    custom={i}
                    variants={menuItemVariants}
                    whileHover={{ x: 10 }}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 w-full"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </motion.button>
                ))}
                <motion.button
                  custom={menuItems.length}
                  variants={menuItemVariants}
                  whileHover={{ x: 10 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </motion.button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black z-40"
          />
        )}
      </AnimatePresence>

      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}