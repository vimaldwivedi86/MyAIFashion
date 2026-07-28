import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { openConsentPreferences } from '../../lib/consent';

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);
const IconTwitter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l16 16M4 20L20 4"/>
  </svg>
);
const IconYoutube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="3"/>
    <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-24">
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Sparkles size={16} />
              <span className="text-sm tracking-[0.18em] uppercase font-medium">My AI Fashion</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Design your perfect tee with AI. From concept to doorstep — 100% custom, 100% yours.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-black transition-colors" aria-label="Instagram">
                <IconInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors" aria-label="Twitter">
                <IconTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors" aria-label="YouTube">
                <IconYoutube />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs tracking-[0.14em] uppercase mb-4 font-medium">Shop</h3>
            <ul className="space-y-3">
              {['All Templates', 'New Arrivals', 'Best Sellers', 'Minimal', 'Streetwear', 'Premium'].map((l) => (
                <li key={l}>
                  <Link to="/shop" className="text-sm text-gray-500 hover:text-black transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.14em] uppercase mb-4 font-medium">Create</h3>
            <ul className="space-y-3">
              {['Design Studio', 'AI Generator', 'Upload Design', 'Fabric Guide', 'Size Guide'].map((l) => (
                <li key={l}>
                  <Link to="/studio" className="text-sm text-gray-500 hover:text-black transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs tracking-[0.14em] uppercase mb-4 font-medium">Help</h3>
            <ul className="space-y-3">
              {['FAQ', 'Shipping & Returns', 'Track Order', 'Contact Us', 'Sustainability'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 tracking-wide">
            © {new Date().getFullYear()} My AI Fashion. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-rights" className="text-xs text-gray-400 hover:text-black transition-colors">Privacy Rights</Link>
            <a href="#" className="text-xs text-gray-400 hover:text-black transition-colors">Terms of Use</a>
            <button
              onClick={openConsentPreferences}
              className="text-xs text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
