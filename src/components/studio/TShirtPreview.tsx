import { useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function TShirtPreview() {
  const { customization } = useStore();
  const [designPos, setDesignPos] = useState({ x: 50, y: 38 });
  const [designScale, setDesignScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { selectedTemplate, selectedColor, design } = customization;

  const bgColor = selectedColor?.hex || '#FFFFFF';
  const templateImage = selectedTemplate?.image;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!design) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - designPos.x * 3, y: e.clientY - designPos.y * 3 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = e.currentTarget.getBoundingClientRect();
    const newX = Math.max(10, Math.min(90, ((e.clientX - dragStart.x) / container.width) * 100));
    const newY = Math.max(10, Math.min(80, ((e.clientY - dragStart.y) / container.height) * 100));
    setDesignPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs tracking-[0.14em] uppercase font-medium">Preview</h3>
          {selectedTemplate && (
            <p className="text-[11px] text-gray-500 mt-0.5">{selectedTemplate.name}</p>
          )}
        </div>
        {design && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDesignScale(Math.max(0.3, designScale - 0.1))}
              className="p-1.5 border border-gray-200 hover:border-gray-400 transition-colors"
              title="Zoom out"
            >
              <ZoomOut size={13} />
            </button>
            <button
              onClick={() => setDesignScale(Math.min(2, designScale + 0.1))}
              className="p-1.5 border border-gray-200 hover:border-gray-400 transition-colors"
              title="Zoom in"
            >
              <ZoomIn size={13} />
            </button>
            <button
              onClick={() => { setDesignPos({ x: 50, y: 38 }); setDesignScale(1); }}
              className="p-1.5 border border-gray-200 hover:border-gray-400 transition-colors"
              title="Reset position"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        )}
      </div>

      {/* T-shirt canvas */}
      <div
        className="flex-1 relative select-none overflow-hidden"
        style={{ minHeight: 360 }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background color wash */}
        <div
          className="absolute inset-0 transition-colors duration-300"
          style={{ background: `${bgColor}22` }}
        />

        {/* T-shirt silhouette */}
        <svg
          viewBox="0 0 400 480"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.08))' }}
        >
          <path
            d="M 80 60 L 10 140 L 70 165 L 70 440 L 330 440 L 330 165 L 390 140 L 320 60 L 270 90 Q 200 120 130 90 Z"
            fill={bgColor}
            stroke="#e0e0e0"
            strokeWidth="1.5"
          />
          {/* Collar */}
          <path
            d="M 130 90 Q 165 130 200 128 Q 235 130 270 90"
            fill="none"
            stroke={bgColor === '#FFFFFF' || bgColor === '#FFFFF0' ? '#ccc' : `${bgColor}88`}
            strokeWidth="2"
          />
        </svg>

        {/* Template image overlay */}
        {templateImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[55%] aspect-[3/4]"
              style={{
                maskImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 480'><path d='M 80 60 L 10 140 L 70 165 L 70 440 L 330 440 L 330 165 L 390 140 L 320 60 L 270 90 Q 200 120 130 90 Z'/></svg>")`,
                maskRepeat: 'no-repeat',
                maskSize: '100% 100%',
                overflow: 'hidden',
                opacity: 0.15,
              }}
            >
              <img src={templateImage} alt="template" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Design overlay — draggable */}
        {design && (
          <div
            className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              left: `${designPos.x}%`,
              top: `${designPos.y}%`,
              transform: `translate(-50%, -50%) scale(${designScale})`,
              width: '32%',
              zIndex: 10,
            }}
            onMouseDown={handleMouseDown}
          >
            <img
              src={design.imageUrl}
              alt="Design"
              className="w-full h-auto pointer-events-none"
              draggable={false}
              style={{ mixBlendMode: bgColor === '#111111' ? 'screen' : 'multiply' }}
            />
            <div className="absolute -inset-1 border border-dashed border-gray-400/50 pointer-events-none" />
          </div>
        )}

        {/* Empty state */}
        {!design && !templateImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-300">
              <Move size={28} className="mx-auto mb-2" />
              <p className="text-xs tracking-wide">Choose a template & design</p>
            </div>
          </div>
        )}

        {design && (
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 tracking-wide">
            Drag to reposition · Scroll to scale
          </p>
        )}
      </div>

      {/* Color info */}
      {customization.selectedColor && (
        <div className="mt-4 flex items-center gap-2 p-2 bg-gray-50">
          <span
            className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0"
            style={{ background: customization.selectedColor.hex }}
          />
          <span className="text-[11px] text-gray-600">{customization.selectedColor.name}</span>
          <span className="text-[11px] text-gray-400 ml-auto">{customization.selectedColor.hex}</span>
        </div>
      )}
    </div>
  );
}
