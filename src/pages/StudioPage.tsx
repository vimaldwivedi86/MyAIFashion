import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import TemplateSelector from '../components/studio/TemplateSelector';
import FabricSelector from '../components/studio/FabricSelector';
import DesignUploader from '../components/studio/DesignUploader';
import AIPromptGenerator from '../components/studio/AIPromptGenerator';
import TShirtPreview from '../components/studio/TShirtPreview';
import SizeQuantitySelector from '../components/studio/SizeQuantitySelector';
import AIRecommendations from '../components/studio/AIRecommendations';
import { useStore } from '../store/useStore';
import { templates, fabrics, BASE_PRICE } from '../lib/data';

const STEPS = [
  { id: 'template', label: 'Template' },
  { id: 'fabric', label: 'Fabric' },
  { id: 'design', label: 'Design' },
  { id: 'size', label: 'Size' },
];

type DesignTab = 'upload' | 'ai';

export default function StudioPage() {
  const [searchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState(0);
  const [designTab, setDesignTab] = useState<DesignTab>('ai');
  const { customization, setTemplate, setFabric, addToCart } = useStore();

  // Pre-select template from URL param
  useEffect(() => {
    const tplId = searchParams.get('template');
    if (tplId) {
      const tpl = templates.find((t) => t.id === tplId);
      if (tpl) {
        setTemplate(tpl);
        if (!customization.selectedFabric) setFabric(fabrics[0]);
      }
    } else if (!customization.selectedFabric) {
      setFabric(fabrics[0]);
    }
  }, []);

  const price = Math.round(
    BASE_PRICE *
      (customization.selectedFabric?.priceMultiplier ?? 1) *
      (customization.quantity >= 10 ? 0.9 : 1)
  );

  const isComplete =
    customization.selectedTemplate &&
    customization.selectedFabric &&
    customization.selectedColor &&
    customization.size;

  const handleAddToCart = () => {
    if (!isComplete) return;
    addToCart(price);
  };

  const stepContent = () => {
    switch (activeStep) {
      case 0: return <TemplateSelector />;
      case 1: return <FabricSelector />;
      case 2:
        return (
          <div>
            <div className="flex border border-gray-200 mb-6">
              <button
                onClick={() => setDesignTab('ai')}
                className={`flex-1 py-2.5 text-xs tracking-[0.1em] uppercase transition-colors ${
                  designTab === 'ai' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                }`}
              >
                AI Generate
              </button>
              <button
                onClick={() => setDesignTab('upload')}
                className={`flex-1 py-2.5 text-xs tracking-[0.1em] uppercase transition-colors ${
                  designTab === 'upload' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
                }`}
              >
                Upload
              </button>
            </div>
            {designTab === 'ai' ? <AIPromptGenerator /> : <DesignUploader />}
          </div>
        );
      case 3: return <SizeQuantitySelector />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-6">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-light tracking-tight">Design Studio</h1>
          <p className="text-sm text-gray-500 mt-1">Build your perfect custom tee</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr_300px] gap-6 lg:gap-8">
          {/* Left panel — steps */}
          <aside className="lg:border-r lg:border-gray-100 lg:pr-8">
            {/* Step nav */}
            <div className="flex lg:flex-col gap-1 mb-6 overflow-x-auto hide-scrollbar">
              {STEPS.map((step, i) => {
                const done = i < activeStep || (i === 0 && customization.selectedTemplate) ||
                  (i === 1 && customization.selectedFabric) ||
                  (i === 2 && customization.design) ||
                  (i === 3 && customization.size);
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(i)}
                    className={`flex items-center gap-3 px-3 py-2.5 text-left flex-shrink-0 lg:flex-shrink transition-colors ${
                      activeStep === i ? 'bg-black text-white' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 flex items-center justify-center text-[10px] flex-shrink-0 ${
                        activeStep === i
                          ? 'bg-white text-black'
                          : done
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {done && activeStep !== i ? <Check size={10} /> : i + 1}
                    </span>
                    <span className="text-xs tracking-[0.1em] uppercase">{step.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Step content */}
            <div>{stepContent()}</div>

            {/* Step navigation */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="flex items-center gap-1 text-xs tracking-[0.1em] uppercase px-3 py-2 border border-gray-200 disabled:opacity-30 hover:border-gray-400 transition-colors"
              >
                <ChevronLeft size={12} /> Back
              </button>
              {activeStep < STEPS.length - 1 ? (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs tracking-[0.1em] uppercase px-3 py-2 bg-black text-white hover:bg-gray-900 transition-colors"
                >
                  Next <ChevronRight size={12} />
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!isComplete}
                  className="flex-1 flex items-center justify-center gap-2 text-xs tracking-[0.1em] uppercase px-3 py-2 bg-black text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
                >
                  <ShoppingBag size={13} />
                  Add to Bag — ₹{price.toLocaleString()}
                </button>
              )}
            </div>
          </aside>

          {/* Center — T-shirt preview */}
          <div className="flex flex-col">
            <div className="sticky top-20 bg-gray-50 p-6 lg:p-10" style={{ minHeight: 480 }}>
              <TShirtPreview />
            </div>
          </div>

          {/* Right panel — summary + AI recommendations */}
          <aside className="lg:border-l lg:border-gray-100 lg:pl-8 space-y-6">
            {/* Order summary */}
            <div>
              <h3 className="text-xs tracking-[0.14em] uppercase mb-4 font-medium">Your Selection</h3>
              <dl className="space-y-3">
                {[
                  { label: 'Template', value: customization.selectedTemplate?.name || '—' },
                  { label: 'Fabric', value: customization.selectedFabric?.name || '—' },
                  { label: 'Colour', value: customization.selectedColor?.name || '—' },
                  { label: 'Design', value: customization.design ? `${customization.design.type === 'ai-generated' ? 'AI Generated' : 'Uploaded'}` : '—' },
                  { label: 'Size', value: customization.size || '—' },
                  { label: 'Qty', value: String(customization.quantity) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start">
                    <dt className="text-[11px] text-gray-400 tracking-wide">{label}</dt>
                    <dd className="text-[11px] text-gray-800 text-right max-w-[60%] truncate">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="border-t border-gray-100 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Price / item</span>
                  <span className="text-base font-medium">₹{price.toLocaleString()}</span>
                </div>
                {customization.quantity > 1 && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">Total ({customization.quantity} pcs)</span>
                    <span className="text-sm">₹{(price * customization.quantity).toLocaleString()}</span>
                  </div>
                )}
                {customization.quantity >= 10 && (
                  <p className="text-[10px] text-green-700 mt-1">10% bulk discount applied</p>
                )}
              </div>
            </div>

            {/* AI Style Advisor */}
            <AIRecommendations />

            {/* Add to cart button on desktop */}
            <button
              onClick={handleAddToCart}
              disabled={!isComplete}
              className="w-full flex items-center justify-center gap-2 bg-black text-white text-xs tracking-[0.14em] uppercase py-4 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
            >
              <ShoppingBag size={14} />
              {isComplete ? `Add to Bag — ₹${price.toLocaleString()}` : 'Complete Your Design'}
            </button>

            {!isComplete && (
              <p className="text-[11px] text-gray-400 text-center -mt-2">
                Select template, fabric, colour & size
              </p>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: '🌱', text: 'Eco-friendly inks' },
                { icon: '✓', text: 'Quality checked' },
                { icon: '🚚', text: '5–7 day delivery' },
                { icon: '↩', text: '30-day returns' },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5">
                  <span className="text-sm">{b.icon}</span>
                  <span className="text-[10px] text-gray-500 leading-tight">{b.text}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
