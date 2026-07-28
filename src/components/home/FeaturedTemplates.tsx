import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { templates } from '../../lib/data';

export default function FeaturedTemplates() {
  const featured = templates.slice(0, 4);

  return (
    <section className="py-20 max-w-[1440px] mx-auto px-6">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.14em] uppercase text-gray-500 mb-2">Curated</p>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight">New Templates</h2>
        </div>
        <Link
          to="/shop"
          className="hidden sm:flex items-center gap-2 text-xs tracking-[0.12em] uppercase hover:gap-3 transition-all"
        >
          View All <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {featured.map((template, i) => (
          <Link
            key={template.id}
            to={`/studio?template=${template.id}`}
            className="group block"
          >
            <div className="aspect-[3/4] bg-gray-50 overflow-hidden mb-3 relative">
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {i === 0 && (
                <span className="absolute top-3 left-3 bg-black text-white text-[10px] tracking-[0.1em] uppercase px-2 py-1">
                  New
                </span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
                <span className="bg-white text-black text-xs tracking-[0.12em] uppercase px-5 py-2.5">
                  Customise
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {template.previewColors.map((hex) => (
                  <span
                    key={hex}
                    className="w-3 h-3 rounded-full border border-gray-200"
                    style={{ background: hex }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium">{template.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{template.style} · {template.gender}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/shop"
        className="sm:hidden flex items-center gap-2 text-xs tracking-[0.12em] uppercase mt-8"
      >
        View All Templates <ArrowRight size={12} />
      </Link>
    </section>
  );
}
