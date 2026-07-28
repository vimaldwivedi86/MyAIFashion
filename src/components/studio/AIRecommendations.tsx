import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

async function fetchRecommendation(payload: {
  template: string;
  fabric: string;
  colour: string;
  designType: string;
}): Promise<string> {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${res.status}`);
  }
  const data = await res.json();
  return data.recommendation as string;
}

export default function AIRecommendations() {
  const { customization } = useStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState('');

  const getRecommendation = async () => {
    setOpen(true);
    setLoading(true);
    setError('');
    setRecommendation('');
    try {
      const text = await fetchRecommendation({
        template: customization.selectedTemplate?.name ?? 'not chosen',
        fabric: customization.selectedFabric?.name ?? 'not chosen',
        colour: customization.selectedColor?.name ?? 'not chosen',
        designType: customization.design
          ? customization.design.type === 'ai-generated'
            ? 'AI-generated graphic'
            : 'custom uploaded design'
          : 'no design yet',
      });
      setRecommendation(text);
    } catch (err: any) {
      // Friendly fallback when ANTHROPIC_API_KEY isn't set yet
      if (err.message?.includes('ANTHROPIC_API_KEY')) {
        setError('Add your ANTHROPIC_API_KEY to the .env file to enable AI recommendations.');
      } else {
        setError('Could not reach the AI advisor. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (open) {
      setOpen(false);
    } else {
      getRecommendation();
    }
  };

  return (
    <div className="border border-gray-200">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={14} />
          <span className="text-xs tracking-[0.1em] uppercase font-medium">AI Style Advisor</span>
          <span className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 tracking-wide">
            Claude
          </span>
        </div>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="border-t border-gray-100 p-3">
          {loading && (
            <div className="flex items-center gap-2 py-2">
              <Loader2 size={13} className="animate-spin text-gray-400" />
              <span className="text-xs text-gray-500">Asking Claude for advice...</span>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-start gap-2">
              <AlertCircle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-amber-700 leading-relaxed">{error}</p>
            </div>
          )}

          {recommendation && !loading && (
            <div>
              <p className="text-xs text-gray-600 leading-relaxed">{recommendation}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <span className="text-[10px] text-gray-400">Powered by Claude claude-opus-4-5</span>
                <button
                  onClick={getRecommendation}
                  className="text-[10px] tracking-[0.1em] uppercase text-gray-400 hover:text-black transition-colors underline"
                >
                  Ask again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
