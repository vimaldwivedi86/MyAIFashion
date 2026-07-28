import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Leaf, Shield, Truck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#F9F7F4] py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.14em] uppercase text-gray-500 mb-4">Our Story</p>
            <h1 className="text-4xl lg:text-6xl font-light tracking-tight mb-8">
              Fashion that's<br />
              <em className="italic">truly</em> yours
            </h1>
            <p className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-xl">
              My AI Fashion was born from a simple frustration: why is it so hard to wear something that feels genuinely personal?
              We built the tools to make truly custom clothing accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Sparkles, title: 'AI-First Design', desc: 'Original art, generated on demand. Never a template you\'ve seen a hundred times before.' },
            { icon: Leaf, title: 'Sustainable', desc: 'Organic fabrics, eco inks, recycled packaging. Fashion that doesn\'t cost the planet.' },
            { icon: Shield, title: 'Copyright Safe', desc: 'Every AI-generated design is 100% original. We never reproduce trademarked or copyrighted imagery.' },
            { icon: Truck, title: 'Print on Demand', desc: 'We only print what\'s ordered. No surplus, no waste — just your tee, made with care.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="border-t border-gray-200 pt-6">
              <Icon size={22} className="mb-4" />
              <h3 className="text-base font-medium mb-2 tracking-tight">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team visual */}
      <section className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
              alt="Our team"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:pl-8">
            <p className="text-xs tracking-[0.14em] uppercase text-gray-500 mb-3">The Mission</p>
            <h2 className="text-3xl font-light tracking-tight mb-6">
              We handle the craft.<br />
              You focus on the vision.
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Our in-house print team uses Direct-to-Garment (DTG) technology for vibrant, wash-resistant prints that feel as good as they look.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              Every order goes through a quality check before shipping — we won't send anything we wouldn't wear ourselves.
            </p>
            <Link
              to="/studio"
              className="inline-flex items-center gap-3 bg-black text-white text-xs tracking-[0.14em] uppercase px-8 py-3 hover:bg-gray-900 transition-colors group"
            >
              Start Creating
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#F9F7F4] mt-12">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.14em] uppercase text-gray-500 mb-3 text-center">FAQ</p>
            <h2 className="text-3xl font-light tracking-tight mb-12 text-center">Common Questions</h2>
            <div className="space-y-8">
              {[
                {
                  q: 'How does the AI design generator work?',
                  a: 'You describe your idea in plain language, optionally pick an art style, and our AI model generates a completely original image. The output is copyright-free and exclusive to your order.'
                },
                {
                  q: 'Can I upload my own artwork?',
                  a: 'Yes. You can upload PNG, JPG, or SVG files up to 10MB. We only accept original artwork — our team reviews every order and rejects uploads that infringe on existing trademarks or copyrights.'
                },
                {
                  q: 'How long does delivery take?',
                  a: 'We print and dispatch within 2 business days. Standard delivery is 3–5 business days, so most orders arrive within 5–7 days of placing your order.'
                },
                {
                  q: 'What if the print quality isn\'t right?',
                  a: 'We guarantee satisfaction. If your order has a print defect, we\'ll reprint or refund — no questions asked within 30 days of delivery.'
                },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-gray-200 pb-8">
                  <h3 className="text-sm font-medium mb-3">{q}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
