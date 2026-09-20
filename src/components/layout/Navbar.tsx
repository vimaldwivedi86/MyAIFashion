import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated, getUser, logout } from '../../lib/auth';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, toggleCart } = useStore();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Collections', to: '/shop' },
    { label: 'Design Studio', to: '/studio' },
    { label: 'Fabrics', to: '/fabrics' },
    { label: 'About', to: '/about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm shadow-[0_1px_0_0_#e5e5e5]' : 'bg-white'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex items-center gap-2"
            >
              <Sparkles size={18} className="text-black" />
              <span className="text-sm font-medium tracking-[0.18em] uppercase">My AI Fashion</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-xs tracking-[0.12em] uppercase transition-colors duration-200 underline-animate ${
                    location.pathname === link.to ? 'text-black' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {isAuthenticated() ? (
                <>
                  <Link to="/account" className="text-xs text-gray-600 hover:text-black transition-colors">
                    {getUser()?.username}
                  </Link>
                  <button
                    onClick={() => { logout(); window.location.reload(); }}
                    className="text-xs text-gray-500 hover:text-black transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-xs text-gray-500 hover:text-black transition-colors">Login</Link>
              )}
              <Link
                to="/studio"
                className="hidden lg:flex items-center gap-2 bg-black text-white text-xs tracking-[0.12em] uppercase px-4 py-2 hover:bg-gray-900 transition-colors"
              >
                <Sparkles size={12} />
                Create
              </Link>
              <button
                onClick={toggleCart}
                className="relative p-2"
                aria-label="Open cart"
              >
                <ShoppingBag size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <nav className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm tracking-[0.12em] uppercase text-gray-700 hover:text-black"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/studio"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 bg-black text-white text-xs tracking-[0.12em] uppercase px-4 py-3 w-fit mt-2"
              >
                <Sparkles size={12} />
                Create Your Design
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-14" />
    </>
  );
}
