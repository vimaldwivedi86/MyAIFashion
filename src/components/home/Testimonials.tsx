const testimonials = [
  {
    quote: "I designed a tee for my band in 20 minutes. The AI generated exactly the vibe I was going for. Print quality is incredible.",
    author: "Arjun M.",
    location: "Mumbai",
    rating: 5,
  },
  {
    quote: "Ordered for my startup team. The fabric selector helped us pick the right weight. Everyone loves them.",
    author: "Priya K.",
    location: "Bangalore",
    rating: 5,
  },
  {
    quote: "Finally a service where I can upload my own artwork without quality loss. The DTG printing is flawless.",
    author: "Rohan S.",
    location: "Delhi",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#111111] text-white">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.14em] uppercase text-white/40 mb-2">Reviews</p>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight">What Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((t, i) => (
            <div key={i} className="border-t border-white/10 pt-8">
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-white text-sm">★</span>
                ))}
              </div>
              <blockquote className="text-white/80 text-sm leading-relaxed mb-6">
                "{t.quote}"
              </blockquote>
              <div>
                <p className="text-sm font-medium">{t.author}</p>
                <p className="text-xs text-white/40 mt-0.5">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
