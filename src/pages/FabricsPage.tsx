import { Link } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';
import { fabrics } from '../lib/data';

export default function FabricsPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      {/* Header */}
      <div className="max-w-2xl mb-16">
        <p className="text-xs tracking-[0.14em] uppercase text-gray-500 mb-3">Materials</p>
        <h1 className="text-4xl lg:text-5xl font-light tracking-tight mb-6">Our Fabrics</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          We source premium fabrics with a focus on comfort, durability, and sustainability.
          Every option is carefully selected to carry print beautifully and last wash after wash.
        </p>
      </div>

      {/* Fabric cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
        {fabrics.map((fabric) => (
          <div key={fabric.id} className="border border-gray-100 p-6 lg:p-8 group hover:border-gray-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-light tracking-tight">{fabric.name}</h2>
                  {fabric.recommended && (
                    <span className="text-[10px] tracking-[0.08em] uppercase bg-black text-white px-2 py-0.5">
                      Most Popular
                    </span>
                  )}
                  {fabric.id === 'fab-005' && (
                    <span className="flex items-center gap-1 text-[10px] tracking-[0.08em] uppercase text-green-700 border border-green-300 px-2 py-0.5">
                      <Leaf size={9} /> Eco
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{fabric.composition}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Weight</p>
                <p className="text-sm font-medium">{fabric.weight}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 italic mb-5">{fabric.feel}</p>

            {/* Color swatches */}
            <div className="mb-5">
              <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-2">Available in {fabric.colors.length} colours</p>
              <div className="flex gap-2">
                {fabric.colors.map((c) => (
                  <div key={c.id} title={c.name} className="flex flex-col items-center gap-1">
                    <span
                      className="w-8 h-8 rounded-full border border-gray-200"
                      style={{ background: c.hex }}
                    />
                    <span className="text-[9px] text-gray-400 text-center w-10 truncate">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Care */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {fabric.careInstructions.map((care) => (
                <span key={care} className="text-[10px] text-gray-500 border border-gray-100 px-2 py-1">
                  {care}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {fabric.priceMultiplier === 1 ? 'Base price' : `+${Math.round((fabric.priceMultiplier - 1) * 100)}% premium`}
              </p>
              <Link
                to={`/studio`}
                className="flex items-center gap-2 text-xs tracking-[0.1em] uppercase hover:gap-3 transition-all"
              >
                Design in this fabric <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Sustainability note */}
      <div className="bg-[#F4F9F4] p-8 lg:p-12 flex flex-col lg:flex-row items-start gap-6">
        <Leaf size={28} className="text-green-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-light tracking-tight mb-3">Our Commitment to Sustainability</h3>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            We use GOTS-certified organic cotton, water-based eco inks, and minimise packaging waste.
            Our bamboo viscose option is grown without pesticides and uses a closed-loop production process.
            Every order ships in 100% recycled packaging.
          </p>
        </div>
      </div>
    </div>
  );
}
