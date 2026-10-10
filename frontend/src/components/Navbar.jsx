// frontend/src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import {
  FaShoppingCart,
  FaCut,
  FaUser,
  FaSignOutAlt,
  FaSearchLocation,
  FaUserShield,
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Cart from './Cart';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Services', href: '/#services' },
    { name: 'AI Style Advisor', href: '/#ai-advisor' },
    { name: 'Store', href: '/#store' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Contact', href: '/#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully!');
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark/95 backdrop-blur-md shadow-lg shadow-gold/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <FaCut className="text-gold text-2xl" />
              <span className="text-2xl font-heading font-extrabold text-white">
                BLADE <span className="text-gold">&</span> CROWN
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-light hover:text-gold transition-colors duration-300 text-sm uppercase tracking-wider font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Track Order */}
              <Link
                to="/track-order"
                className="hidden sm:flex text-gray-light hover:text-gold transition-colors p-2"
                title="Track Order"
              >
                <FaSearchLocation className="text-lg" />
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:text-gold transition-colors p-2"
                aria-label="Open Cart"
              >
                <FaShoppingCart className="text-xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-dark text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-gold/10 border border-gold/30 px-3 py-2 rounded-lg hover:bg-gold/20 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gold text-dark flex items-center justify-center font-bold text-sm">
                      {user?.first_name?.[0]?.toUpperCase() ||
                        user?.username?.[0]?.toUpperCase() ||
                        'U'}
                    </div>
                    <span className="text-white text-sm hidden sm:block">
                      {user?.first_name || user?.username}
                    </span>
                  </button>

                  {/* DESKTOP USER DROPDOWN MENU */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-gold/20 rounded-lg shadow-xl overflow-hidden z-50">
                      {/* User Info Header */}
                      <div className="p-3 border-b border-gray-dark">
                        <p className="text-white font-medium text-sm">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-gray-light text-xs truncate">
                          {user?.email}
                        </p>
                        {user?.is_staff && (
                          <span className="inline-block mt-1 bg-gold/20 text-gold text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                            Admin
                          </span>
                        )}
                      </div>

                      {/* My Profile */}
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full text-left px-4 py-2.5 text-white hover:bg-gold/10 text-sm flex items-center gap-2 transition-colors"
                      >
                        <FaUser className="text-gold" /> My Profile
                      </Link>

                      {/* Admin Panel - Only for staff/admin users */}
                      {user?.is_staff && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full text-left px-4 py-2.5 text-gold hover:bg-gold/10 text-sm flex items-center gap-2 font-bold transition-colors"
                        >
                          <FaUserShield /> Admin Panel
                        </Link>
                      )}

                      {/* Track Order */}
                      <Link
                        to="/track-order"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full text-left px-4 py-2.5 text-white hover:bg-gold/10 text-sm flex items-center gap-2 transition-colors"
                      >
                        <FaSearchLocation className="text-gold" /> Track Order
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-error hover:bg-error/10 text-sm flex items-center gap-2 transition-colors border-t border-gray-dark"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-white hover:text-gold px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gold text-dark px-5 py-2 font-semibold text-sm uppercase tracking-wider rounded hover:bg-gold-light transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-white text-2xl p-1"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Menu"
              >
                <HiMenu />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* ==================== MOBILE MENU ==================== */}
      <div
        className={`fixed inset-0 z-50 bg-dark/98 backdrop-blur-lg transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full relative">
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white text-3xl hover:text-gold transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close Menu"
          >
            <HiX />
          </button>

          <div className="flex flex-col items-center gap-6 overflow-y-auto w-full px-4 pb-10 max-h-screen pt-20">
            {/* Nav Links */}
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-heading font-bold text-white hover:text-gold uppercase tracking-wider transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            <div className="w-24 h-px bg-gray-dark my-2" />

            {/* Cart */}
            <button
              onClick={() => {
                setIsCartOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-xl text-white hover:text-gold flex items-center gap-2 transition-colors"
            >
              <FaShoppingCart /> Cart ({totalItems})
            </button>

            {/* Track Order */}
            <Link
              to="/track-order"
              className="text-xl text-white hover:text-gold flex items-center gap-2 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaSearchLocation /> Track Order
            </Link>

            {/* Auth Links */}
            {!isAuthenticated ? (
              <div className="flex flex-col items-center gap-4 mt-4">
                <Link
                  to="/login"
                  className="text-xl text-white hover:text-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gold text-dark px-10 py-3 font-bold text-lg uppercase tracking-wider rounded hover:bg-gold-light transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 mt-4">
                {/* User Badge */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gold text-dark flex items-center justify-center font-bold">
                    {user?.first_name?.[0]?.toUpperCase() ||
                      user?.username?.[0]?.toUpperCase() ||
                      'U'}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      {user?.first_name || user?.username}
                    </p>
                    {user?.is_staff && (
                      <span className="text-gold text-xs font-bold">Admin</span>
                    )}
                  </div>
                </div>

                {/* My Profile */}
                <Link
                  to="/profile"
                  className="text-xl text-white hover:text-gold flex items-center gap-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser /> My Profile
                </Link>

                {/* Admin Panel - Only for staff */}
                {user?.is_staff && (
                  <Link
                    to="/admin"
                    className="text-xl text-gold hover:text-gold-light flex items-center gap-2 font-bold transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUserShield /> Admin Panel
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="bg-error text-white px-10 py-3 font-bold text-lg uppercase tracking-wider rounded flex items-center gap-2 hover:bg-error/80 transition-colors mt-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;