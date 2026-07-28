import { Minus, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const SIZE_GUIDE = [
  { size: 'XS', chest: '84–88', length: '67' },
  { size: 'S', chest: '88–92', length: '69' },
  { size: 'M', chest: '92–98', length: '71' },
  { size: 'L', chest: '98–104', length: '73' },
  { size: 'XL', chest: '104–110', length: '75' },
  { size: 'XXL', chest: '110–118', length: '77' },
];

export default function SizeQuantitySelector() {
  const { customization, setSize, setQuantity } = useStore();

  return (
    <div>
      {/* Size */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs tracking-[0.14em] uppercase font-medium">Size</h3>
          <button className="text-[11px] text-gray-500 underline underline-offset-2 hover:text-black transition-colors">
            Size Guide
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSize(size)}
              className={`min-w-[44px] h-10 text-xs tracking-[0.08em] border transition-colors ${
                customization.size === size
                  ? 'bg-black text-white border-black'
                  : 'border-gray-200 text-gray-700 hover:border-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Compact size chart */}
        <div className="mt-3 overflow-x-auto hide-scrollbar">
          <table className="w-full text-[10px] text-gray-500 border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-1.5 pr-4 font-normal tracking-[0.08em] uppercase">Size</th>
                <th className="text-left py-1.5 pr-4 font-normal tracking-[0.08em] uppercase">Chest (cm)</th>
                <th className="text-left py-1.5 font-normal tracking-[0.08em] uppercase">Length (cm)</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((row) => (
                <tr
                  key={row.size}
                  className={`border-b border-gray-50 ${customization.size === row.size ? 'text-black font-medium' : ''}`}
                >
                  <td className="py-1.5 pr-4">{row.size}</td>
                  <td className="py-1.5 pr-4">{row.chest}</td>
                  <td className="py-1.5">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h3 className="text-xs tracking-[0.14em] uppercase font-medium mb-3">Quantity</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, customization.quantity - 1))}
            className="w-9 h-9 border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
          >
            <Minus size={13} />
          </button>
          <span className="text-sm w-8 text-center font-medium">{customization.quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(50, customization.quantity + 1))}
            className="w-9 h-9 border border-gray-200 flex items-center justify-center hover:border-black transition-colors"
          >
            <Plus size={13} />
          </button>
          {customization.quantity >= 10 && (
            <span className="text-[10px] text-green-700 bg-green-50 px-2 py-1 border border-green-200">
              Bulk discount applied
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
