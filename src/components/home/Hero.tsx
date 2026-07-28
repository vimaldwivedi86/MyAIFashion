import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F9F7F4] min-h-[90vh] flex flex-col">
      {/* Background editorial image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80"
          alt="Fashion editorial"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F9F7F4]/60 via-[#F9F7F4]/30 to-[#F9F7F4]/90" />
      </div>

      <div className="relative flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-6">
        {/* Top tag */}
        <div className="pt-12 lg:pt-16">
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-gray-600 border border-gray-300 px-3 py-1.5">
            <Sparkles size={10} />
            AI-Powered Design
          </span>
        </div>

        {/* Hero content */}
        <div className="flex-1 flex flex-col justify-center pb-16">
          <div className="max-w-3xl">
            <h1 className="text-[clamp(2.5rem,8vw,7rem)] leading-[0.92] tracking-[-0.04em] font-light mb-8">
              Wear
              <br />
              <em className="italic">Your</em>
              <br />
              Vision
            </h1>
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-md mb-10">
              Design custom tees with AI-generated art, your own uploads, and expert fabric curation.
              From concept to your door in 5–7 days.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/studio"
                className="inline-flex items-center gap-3 bg-black text-white text-xs tracking-[0.14em] uppercase px-8 py-4 hover:bg-gray-900 transition-colors group"
              >
                Start Designing
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 text-xs tracking-[0.14em] uppercase px-8 py-4 border border-black hover:bg-black hover:text-white transition-colors"
              >
                Browse Templates
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-3 gap-4 pb-12 border-t border-black/10 pt-8">
          {[
            { value: '200+', label: 'Templates' },
            { value: '5 Fabrics', label: 'Premium Options' },
            { value: '5–7 Days', label: 'Delivery' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-lg lg:text-2xl font-light tracking-tight">{stat.value}</p>
              <p className="text-xs text-gray-500 tracking-[0.1em] uppercase mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
