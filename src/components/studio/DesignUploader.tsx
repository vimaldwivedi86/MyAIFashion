import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Design } from '../../types';

const BLOCKED_KEYWORDS = [
  'nike', 'adidas', 'puma', 'reebok', 'gucci', 'louis vuitton', 'lv',
  'supreme', 'off-white', 'balenciaga', 'versace', 'armani', 'ferrari',
  'coca-cola', 'pepsi', 'mcdonald', 'apple logo', 'google', 'facebook',
  'instagram', 'disney', 'marvel', 'dc comics', 'nba', 'nfl', 'fifa',
  'olympic rings', 'olympic', 'uefa', 'formula 1', 'f1',
];

export default function DesignUploader() {
  const { setDesign, customization } = useStore();
  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setWarning('');
    setSuccess('');

    const name = file.name.toLowerCase();
    const blocked = BLOCKED_KEYWORDS.some((kw) => name.includes(kw));
    if (blocked) {
      setWarning('This file name suggests a copyrighted logo or brand. Please upload only original artwork to avoid copyright infringement.');
      return;
    }

    const url = URL.createObjectURL(file);
    const design: Design = {
      id: crypto.randomUUID(),
      type: 'upload',
      imageUrl: url,
      position: { x: 50, y: 40 },
      scale: 1,
      rotation: 0,
    };
    setDesign(design);
    setSuccess(`"${file.name}" uploaded successfully.`);
  }, [setDesign]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
  });

  const remove = () => {
    setDesign(null);
    setWarning('');
    setSuccess('');
  };

  return (
    <div>
      <h3 className="text-xs tracking-[0.14em] uppercase mb-4 font-medium">Upload Your Design</h3>

      {/* Copyright notice */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 p-3 mb-4">
        <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-amber-700 leading-relaxed">
          Only upload original artwork. Uploading trademarked logos, brand icons, or copyrighted designs is prohibited and will be rejected during print review.
        </p>
      </div>

      {customization.design?.type === 'upload' ? (
        <div className="border border-gray-200 p-3 flex items-center gap-3">
          <div className="w-16 h-16 bg-gray-50 flex-shrink-0 overflow-hidden">
            <img
              src={customization.design.imageUrl}
              alt="Uploaded design"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium">Design uploaded</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Positioned on tee preview</p>
          </div>
          <button onClick={remove} className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={24} className="mx-auto mb-3 text-gray-400" />
          <p className="text-xs font-medium mb-1">
            {isDragActive ? 'Drop here' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-[11px] text-gray-400">PNG, JPG, SVG · Max 10MB · Original artwork only</p>
        </div>
      )}

      {warning && (
        <div className="flex items-start gap-2 mt-3 p-3 bg-red-50 border border-red-200">
          <AlertCircle size={13} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-red-600">{warning}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-green-50 border border-green-200">
          <CheckCircle size={13} className="text-green-600 flex-shrink-0" />
          <p className="text-[11px] text-green-700">{success}</p>
        </div>
      )}
    </div>
  );
}
