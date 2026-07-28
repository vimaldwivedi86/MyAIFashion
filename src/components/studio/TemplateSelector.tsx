import { useState } from 'react';
import { Check } from 'lucide-react';
import { templates, categories } from '../../lib/data';
import { useStore } from '../../store/useStore';

export default function TemplateSelector() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { customization, setTemplate } = useStore();

  const filtered = activeCategory === 'All'
    ? templates
    : templates.filter((t) => t.category === activeCategory);

  return (
    <div>
      <h3 className="text-xs tracking-[0.14em] uppercase mb-4 font-medium">Choose Template</h3>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 border transition-colors ${
              activeCategory === cat
                ? 'bg-black text-white border-black'
                : 'border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((template) => {
          const isSelected = customization.selectedTemplate?.id === template.id;
          return (
            <button
              key={template.id}
              onClick={() => setTemplate(template)}
              className={`relative group text-left transition-all ${
                isSelected ? 'ring-2 ring-black' : 'ring-1 ring-gray-100 hover:ring-gray-300'
              }`}
            >
              <div className="aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate">{template.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{template.category}</p>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-black text-white flex items-center justify-center">
                  <Check size={12} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
