import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Leaf } from 'lucide-react';
import { fabrics } from '../../lib/data';
import { useStore } from '../../store/useStore';

export default function FabricSelector() {
  const [expandedFabric, setExpandedFabric] = useState<string | null>(null);
  const { customization, setFabric, setColor } = useStore();

  return (
    <div>
      <h3 className="text-xs tracking-[0.14em] uppercase mb-4 font-medium">Choose Fabric</h3>

      <div className="space-y-2">
        {fabrics.map((fabric) => {
          const isSelected = customization.selectedFabric?.id === fabric.id;
          const isExpanded = expandedFabric === fabric.id;

          return (
            <div
              key={fabric.id}
              className={`border transition-colors ${
                isSelected ? 'border-black' : 'border-gray-200'
              }`}
            >
              <button
                className="w-full p-3 flex items-start justify-between gap-3 text-left"
                onClick={() => {
                  setFabric(fabric);
                  setExpandedFabric(isExpanded ? null : fabric.id);
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium">{fabric.name}</p>
                    {fabric.recommended && (
                      <span className="text-[10px] tracking-[0.08em] uppercase bg-black text-white px-1.5 py-0.5">
                        Popular
                      </span>
                    )}
                    {fabric.id === 'fab-005' && (
                      <Leaf size={11} className="text-green-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{fabric.composition} · {fabric.weight}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {fabric.priceMultiplier > 1 && (
                    <span className="text-[10px] text-gray-500">+{Math.round((fabric.priceMultiplier - 1) * 100)}%</span>
                  )}
                  {isSelected ? <Check size={14} /> : (isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </button>

              {/* Expanded details */}
              {(isSelected || isExpanded) && (
                <div className="px-3 pb-3 border-t border-gray-100 pt-3">
                  <p className="text-[11px] text-gray-500 mb-3 italic">{fabric.feel}</p>

                  {/* Color swatches */}
                  <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-2">Available Colours</p>
                  <div className="flex flex-wrap gap-2">
                    {fabric.colors.map((color) => {
                      const isColorSelected = customization.selectedColor?.id === color.id && isSelected;
                      return (
                        <button
                          key={color.id}
                          title={color.name}
                          onClick={(e) => { e.stopPropagation(); if (isSelected) setColor(color); }}
                          disabled={!color.available}
                          className={`relative w-7 h-7 rounded-full border-2 transition-all ${
                            isColorSelected
                              ? 'border-black scale-110'
                              : 'border-transparent hover:border-gray-400'
                          } ${!color.available ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                          style={{ background: color.hex, boxShadow: '0 0 0 1px #e5e5e5' }}
                        >
                          {isColorSelected && (
                            <span
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ color: color.hex === '#FFFFFF' || color.hex === '#FFFFF0' ? '#111' : '#fff' }}
                            >
                              <Check size={10} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Care */}
                  <div className="mt-3">
                    <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-1.5">Care</p>
                    <div className="flex flex-wrap gap-1.5">
                      {fabric.careInstructions.map((care) => (
                        <span key={care} className="text-[10px] text-gray-500 border border-gray-200 px-2 py-0.5">
                          {care}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
