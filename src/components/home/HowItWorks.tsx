import { Palette, Upload, Sparkles, Package } from 'lucide-react';

const steps = [
  {
    icon: Palette,
    number: '01',
    title: 'Choose a Template',
    description: 'Browse 200+ professionally crafted templates across styles — minimal, streetwear, premium and more.',
  },
  {
    icon: Sparkles,
    number: '02',
    title: 'Design with AI',
    description: 'Describe your vision in plain language. Our AI generates unique, copyright-free artwork tailored to your idea.',
  },
  {
    icon: Upload,
    number: '03',
    title: 'Customise',
    description: 'Upload your own image, pick premium fabrics, choose colors, and position your design exactly as you like.',
  },
  {
    icon: Package,
    number: '04',
    title: 'We Print & Ship',
    description: 'We handle printing with eco-friendly inks and ship your custom tee to your door in 5–7 business days.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-[#F9F7F4]">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.14em] uppercase text-gray-500 mb-2">Process</p>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <span className="text-xs tracking-[0.1em] text-gray-400 mt-1">{step.number}</span>
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center flex-shrink-0">
                  <step.icon size={18} />
                </div>
              </div>
              <div>
                <h3 className="text-base font-medium mb-2 tracking-tight">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
