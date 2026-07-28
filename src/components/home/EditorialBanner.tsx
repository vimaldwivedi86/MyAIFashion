import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function EditorialBanner() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left large panel */}
        <div className="relative bg-[#1A1A1A] aspect-[4/5] lg:aspect-auto overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=80"
            alt="AI Design Studio"
            className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-end">
            <span className="text-white/60 text-xs tracking-[0.14em] uppercase mb-3">New Feature</span>
            <h2 className="text-white text-3xl lg:text-4xl font-light tracking-tight mb-4">
              AI Design<br />Generator
            </h2>
            <p className="text-white/70 text-sm mb-6 max-w-xs leading-relaxed">
              Type your idea. Watch AI create original, copyright-free art for your tee in seconds.
            </p>
            <Link
              to="/studio"
              className="inline-flex items-center gap-3 text-white border border-white/50 text-xs tracking-[0.12em] uppercase px-6 py-3 w-fit hover:bg-white hover:text-black transition-all group/btn"
            >
              Try It Now
              <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right two stacked panels */}
        <div className="grid grid-rows-2 gap-4">
          <div className="relative bg-[#F0EDE8] overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80"
              alt="Premium fabrics"
              className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="text-xs tracking-[0.14em] uppercase text-gray-600 mb-1">Materials</span>
              <h3 className="text-xl font-light tracking-tight mb-2">Premium Fabrics</h3>
              <Link to="/fabrics" className="text-xs tracking-[0.12em] uppercase underline underline-offset-4 w-fit">
                Explore →
              </Link>
            </div>
          </div>

          <div className="relative bg-[#1B2A4A] overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80"
              alt="Color recommendations"
              className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="text-white/60 text-xs tracking-[0.14em] uppercase mb-1">AI Powered</span>
              <h3 className="text-white text-xl font-light tracking-tight mb-2">Smart Color Picks</h3>
              <Link to="/studio" className="text-white text-xs tracking-[0.12em] uppercase underline underline-offset-4 w-fit">
                Explore →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
