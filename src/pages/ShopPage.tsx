import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { templates, categories } from '../lib/data';

const STYLES = ['All', 'crew', 'v-neck', 'polo', 'oversized', 'fitted'];
const GENDERS = ['All', 'unisex', 'men', 'women'];
const SORT_OPTIONS = ['Featured', 'A–Z', 'Z–A'];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStyle, setActiveStyle] = useState('All');
  const [activeGender, setActiveGender] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = templates.filter((t) => {
      const catMatch = activeCategory === 'All' || t.category === activeCategory;
      const styleMatch = activeStyle === 'All' || t.style === activeStyle;
      const genderMatch = activeGender === 'All' || t.gender === activeGender;
      return catMatch && styleMatch && genderMatch;
    });
    if (sortBy === 'A–Z') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'Z–A') result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    return result;
  }, [activeCategory, activeStyle, activeGender, sortBy]);

  const FilterSection = () => (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] tracking-[0.12em] uppercase text-gray-400 mb-3">Category</p>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs text-left py-1 transition-colors ${
                activeCategory === cat ? 'text-black font-medium' : 'text-gray-500 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] tracking-[0.12em] uppercase text-gray-400 mb-3">Style</p>
        <div className="flex flex-col gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStyle(s)}
              className={`text-xs text-left py-1 capitalize transition-colors ${
                activeStyle === s ? 'text-black font-medium' : 'text-gray-500 hover:text-black'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] tracking-[0.12em] uppercase text-gray-400 mb-3">Gender</p>
        <div className="flex flex-col gap-2">
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGender(g)}
              className={`text-xs text-left py-1 capitalize transition-colors ${
                activeGender === g ? 'text-black font-medium' : 'text-gray-500 hover:text-black'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.14em] uppercase text-gray-500 mb-2">Collections</p>
        <h1 className="text-3xl lg:text-4xl font-light tracking-tight">All Templates</h1>
        <p className="text-sm text-gray-500 mt-2">{filtered.length} designs</p>
      </div>

      <div className="flex gap-8 lg:gap-12">
        {/* Desktop sidebar filters */}
        <aside className="hidden lg:block w-44 flex-shrink-0">
          <FilterSection />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 text-xs tracking-[0.1em] uppercase border border-gray-200 px-3 py-2 hover:border-gray-400 transition-colors"
            >
              <SlidersHorizontal size={13} />
              Filters
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <span className="hidden sm:block text-xs text-gray-400">{filtered.length} items</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs tracking-[0.08em] border border-gray-200 px-3 py-2 focus:outline-none focus:border-black bg-white"
              >
                {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-sm">No templates match your filters.</p>
              <button
                onClick={() => { setActiveCategory('All'); setActiveStyle('All'); setActiveGender('All'); }}
                className="mt-3 text-xs underline text-black"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filtered.map((template) => (
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
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100">
                      <span className="bg-white text-black text-[10px] tracking-[0.12em] uppercase px-4 py-2">
                        Customise
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {template.previewColors.slice(0, 4).map((hex) => (
                      <span
                        key={hex}
                        className="w-3 h-3 rounded-full border border-gray-100"
                        style={{ background: hex }}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium">{template.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{template.style} · {template.gender}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {template.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] text-gray-400 border border-gray-100 px-1.5 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setFiltersOpen(false)} />
          <aside className="fixed top-0 left-0 h-full w-72 bg-white z-50 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs tracking-[0.14em] uppercase font-medium">Filters</span>
              <button onClick={() => setFiltersOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <FilterSection />
          </aside>
        </>
      )}
    </div>
  );
}
