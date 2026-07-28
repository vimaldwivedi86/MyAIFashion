import Hero from '../components/home/Hero';
import FeaturedTemplates from '../components/home/FeaturedTemplates';
import HowItWorks from '../components/home/HowItWorks';
import EditorialBanner from '../components/home/EditorialBanner';
import ColorPalettes from '../components/home/ColorPalettes';
import Testimonials from '../components/home/Testimonials';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedTemplates />
      <HowItWorks />
      <EditorialBanner />
      <ColorPalettes />
      <Testimonials />

      {/* CTA Banner */}
      <section className="py-20 max-w-[1440px] mx-auto px-6 text-center">
        <p className="text-xs tracking-[0.14em] uppercase text-gray-500 mb-4">Ready?</p>
        <h2 className="text-4xl lg:text-6xl font-light tracking-tight mb-6">
          Make It Yours
        </h2>
        <p className="text-gray-500 text-sm mb-10 max-w-md mx-auto leading-relaxed">
          Start with a blank tee and let your imagination—or our AI—fill it in.
        </p>
        <Link
          to="/studio"
          className="inline-flex items-center gap-3 bg-black text-white text-xs tracking-[0.14em] uppercase px-10 py-4 hover:bg-gray-900 transition-colors"
        >
          <Sparkles size={13} />
          Open Design Studio
        </Link>
      </section>
    </main>
  );
}
