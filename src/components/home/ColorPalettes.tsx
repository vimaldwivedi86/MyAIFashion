import { colorPalettes } from '../../lib/data';
import { Link } from 'react-router-dom';

export default function ColorPalettes() {
  return (
    <section className="py-20 max-w-[1440px] mx-auto px-6">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs tracking-[0.14em] uppercase text-gray-500 mb-2">AI Curated</p>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight">Colour Stories</h2>
        </div>
        <p className="hidden sm:block text-sm text-gray-500 max-w-xs text-right">
          AI-matched palettes for perfect combinations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {colorPalettes.map((palette) => (
          <Link
            key={palette.name}
            to="/studio"
            className="group block p-6 border border-gray-100 hover:border-gray-300 transition-colors"
          >
            <div className="flex gap-2 mb-4">
              {palette.colors.map((hex) => (
                <div
                  key={hex}
                  className="flex-1 h-12 rounded-sm transition-transform group-hover:scale-y-110"
                  style={{ background: hex }}
                />
              ))}
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium">{palette.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{palette.mood}</p>
              </div>
              <span className="text-xs tracking-[0.1em] uppercase text-gray-400 group-hover:text-black transition-colors">
                Apply →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
