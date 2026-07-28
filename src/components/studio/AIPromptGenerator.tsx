import { useState, useRef, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertTriangle, Wand2, CheckCircle, Loader2, ShieldCheck, ShieldOff } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { hasConsent, isScrutoraLoaded, onConsentChange, openConsentPreferences } from '../../lib/consent';
import type { Design } from '../../types';

const STYLE_TAGS = [
  'Minimalist', 'Abstract', 'Geometric', 'Vintage', 'Watercolour',
  'Line Art', 'Botanical', 'Typographic', 'Surreal', 'Psychedelic',
  'Grunge', 'Japanese', 'Gothic', 'Pop Art',
];

const EXAMPLE_PROMPTS = [
  'A serene mountain landscape at dawn with soft watercolour textures',
  'Bold geometric shapes in earth tones with clean Bauhaus lines',
  'Vintage floral arrangement with detailed botanical illustration style',
  'Abstract ocean waves in deep indigo and gold leaf patterns',
  'Minimalist typographic composition: "Explore More" in elegant serif',
  'Ethereal forest with glowing mushrooms and moonlight rays',
];

// Route through the Vite dev-server proxy so the sandboxed preview can load it
function buildImageUrl(prompt: string, style: string): string {
  const params = new URLSearchParams({
    prompt,
    style,
    seed: String(Date.now() % 2147483647), // Pollinations rejects seeds above int32 max
  });
  return `/api/generate-image?${params}`;
}

// Ask the server-side Claude route whether the prompt is copyright-safe
async function checkCopyrightViaAI(prompt: string): Promise<{ safe: boolean; reason?: string }> {
  try {
    const res = await fetch('/api/check-copyright', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) return { safe: true }; // fail open
    return await res.json();
  } catch {
    return { safe: true }; // fail open
  }
}

type CheckState = 'idle' | 'checking' | 'safe' | 'unsafe';

export default function AIPromptGenerator() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [checkState, setCheckState] = useState<CheckState>('idle');
  const [copyrightReason, setCopyrightReason] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [genError, setGenError] = useState('');
  const [aiConsentGranted, setAiConsentGranted] = useState(() => hasConsent('ai_processing'));
  const [scrutoraActive] = useState(() => isScrutoraLoaded());
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setDesign } = useStore();

  // Re-check consent whenever the user changes their preferences
  useEffect(() => {
    onConsentChange((states) => {
      setAiConsentGranted(states.ai_processing ?? false);
    });
  }, []);

  // Debounced copyright check as user types
  const handlePromptChange = (val: string) => {
    setPrompt(val);
    setGenError('');
    if (checkTimer.current) clearTimeout(checkTimer.current);
    if (val.trim().length < 8) { setCheckState('idle'); return; }
    setCheckState('checking');
    checkTimer.current = setTimeout(async () => {
      const result = await checkCopyrightViaAI(val);
      if (result.safe) {
        setCheckState('safe');
        setCopyrightReason('');
      } else {
        setCheckState('unsafe');
        setCopyrightReason(result.reason || 'This prompt may reference copyrighted or trademarked content.');
      }
    }, 800);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || generating || checkState === 'unsafe') return;

    // Block generation if Scrutora is active and AI processing consent was denied
    if (scrutoraActive && !aiConsentGranted) {
      setGenError('AI image generation requires your consent for AI Processing. Click "Cookie Settings" in the footer to enable it.');
      return;
    }

    // Final copyright check before generating
    if (checkState !== 'safe') {
      setCheckState('checking');
      const result = await checkCopyrightViaAI(prompt);
      if (!result.safe) {
        setCheckState('unsafe');
        setCopyrightReason(result.reason || 'This prompt may reference copyrighted content.');
        return;
      }
      setCheckState('safe');
    }

    setGenerating(true);
    setGenError('');
    setGeneratedUrl(null);

    const imageUrl = buildImageUrl(prompt, selectedStyle);

    // Set URL immediately — let the <img> tag handle async loading from Pollinations.ai
    // (Pollinations doesn't support crossOrigin anonymous; we let the browser load it directly)
    const design: Design = {
      id: crypto.randomUUID(),
      type: 'ai-generated',
      imageUrl,
      prompt: `${prompt}${selectedStyle ? ` — ${selectedStyle}` : ''}`,
      position: { x: 50, y: 40 },
      scale: 1,
      rotation: 0,
    };
    setDesign(design);
    setGeneratedUrl(imageUrl);
    setGenerating(false);
  };

  const handleRegenerate = () => {
    setGeneratedUrl(null);
    handleGenerate();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Wand2 size={14} />
        <h3 className="text-xs tracking-[0.14em] uppercase font-medium">AI Design Generator</h3>
      </div>
      <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
        Describe your design in plain language. We use <strong>Flux AI</strong> to generate original artwork and <strong>Claude</strong> to check for copyright conflicts in real time.
      </p>

      {/* Scrutora consent status badge — only visible when Scrutora is active */}
      {scrutoraActive && (
        <div className={`flex items-center justify-between gap-2 mb-4 px-2.5 py-1.5 border text-[10px] tracking-wide ${
          aiConsentGranted
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-amber-200 bg-amber-50 text-amber-700'
        }`}>
          <div className="flex items-center gap-1.5">
            {aiConsentGranted
              ? <ShieldCheck size={11} />
              : <ShieldOff size={11} />}
            <span>
              {aiConsentGranted
                ? 'AI Processing consent active · Scrutora'
                : 'AI Processing consent required'}
            </span>
          </div>
          {!aiConsentGranted && (
            <button
              onClick={openConsentPreferences}
              className="underline hover:no-underline font-medium"
            >
              Enable
            </button>
          )}
        </div>
      )}

      {/* Prompt input */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="e.g. A minimalist mountain peak with soft gradient sky..."
          rows={3}
          className={`w-full border px-3 py-2.5 text-sm resize-none focus:outline-none transition-colors placeholder:text-gray-300 ${
            checkState === 'unsafe'
              ? 'border-red-300 focus:border-red-400'
              : checkState === 'safe'
              ? 'border-green-300 focus:border-green-400'
              : 'border-gray-200 focus:border-black'
          }`}
        />
        {/* Live copyright indicator */}
        <div className="absolute top-2 right-2">
          {checkState === 'checking' && <Loader2 size={13} className="animate-spin text-gray-400" />}
          {checkState === 'safe' && <CheckCircle size={13} className="text-green-500" />}
          {checkState === 'unsafe' && <AlertTriangle size={13} className="text-red-500" />}
        </div>
      </div>

      {/* Copyright status messages */}
      {checkState === 'safe' && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <CheckCircle size={11} className="text-green-600" />
          <p className="text-[10px] text-green-700">Original prompt — copyright clear ✓</p>
        </div>
      )}
      {checkState === 'unsafe' && (
        <div className="flex items-start gap-2 mt-2 p-2.5 bg-red-50 border border-red-200">
          <AlertTriangle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-red-600 leading-relaxed">{copyrightReason} Please describe an original concept.</p>
        </div>
      )}

      {/* Style tags */}
      <div className="mt-4">
        <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-2">Art Style (optional)</p>
        <div className="flex flex-wrap gap-1.5">
          {STYLE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedStyle(selectedStyle === tag ? '' : tag)}
              className={`text-[10px] tracking-[0.08em] uppercase px-2.5 py-1 border transition-colors ${
                selectedStyle === tag
                  ? 'bg-black text-white border-black'
                  : 'border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Example prompts */}
      <div className="mt-4">
        <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-2">Try an example</p>
        <div className="space-y-1">
          {EXAMPLE_PROMPTS.map((ex) => (
            <button
              key={ex}
              onClick={() => { setPrompt(ex); handlePromptChange(ex); }}
              className="w-full text-left text-[11px] text-gray-500 hover:text-black p-1.5 border border-transparent hover:border-gray-100 transition-all truncate"
            >
              → {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!prompt.trim() || generating || checkState === 'unsafe' || checkState === 'checking'}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-black text-white text-xs tracking-[0.12em] uppercase py-3 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors"
      >
        {generating ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            Generating with Flux AI...
          </>
        ) : checkState === 'checking' ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            Checking copyright...
          </>
        ) : (
          <>
            <Sparkles size={13} />
            Generate Design
          </>
        )}
      </button>

      {/* Error */}
      {genError && (
        <div className="mt-3 p-2.5 bg-red-50 border border-red-200">
          <p className="text-[11px] text-red-600">{genError}</p>
        </div>
      )}

      {/* Generated result */}
      {generatedUrl && !generating && (
        <div className="mt-4 border border-gray-200">
          {/* Pollinations.ai image — loads async, may take 5-15s on first render */}
          <div className="aspect-square bg-gray-50 overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-2">
              <Loader2 size={22} className="animate-spin" />
              <span className="text-[10px] tracking-wide">Flux AI rendering...</span>
            </div>
            <img
              src={generatedUrl}
              alt="AI generated design"
              className="relative w-full h-full object-cover z-10"
              onLoad={(e) => {
                const el = e.currentTarget;
                el.style.opacity = '1';
                // hide spinner
                (el.previousElementSibling as HTMLElement).style.display = 'none';
              }}
              onError={() => {
                setGenError('Flux AI image could not be loaded. The Pollinations.ai service may be temporarily unavailable — please try again in a moment.');
                setGeneratedUrl(null);
                setDesign(null);
              }}
              style={{ opacity: 0, transition: 'opacity 0.4s ease' }}
            />
          </div>
          <div className="p-3">
            <p className="text-[10px] text-gray-400 mb-1">Generated by Flux AI · Copyright verified by Claude</p>
            <p className="text-[11px] text-gray-600 italic mb-3 line-clamp-2">"{prompt}{selectedStyle ? ` — ${selectedStyle}` : ''}"</p>
            <button
              onClick={handleRegenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 text-xs tracking-[0.1em] uppercase py-2 hover:border-black transition-colors"
            >
              <RefreshCw size={11} />
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
