import React, { useCallback, useState } from 'react';
import { Upload, Image, X } from 'lucide-react';

export default function UploadZone({ onImageSelect, preview, onClear }) {
  const [dragging, setDragging] = useState(false);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1];
      onImageSelect({ base64, mimeType: file.type, preview: e.target.result, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(',')[1];
      onImageSelect({ base64, mimeType: file.type, preview: ev.target.result, name: file.name });
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onChange = (e) => processFile(e.target.files[0]);

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-[#21262d] bg-[#161b22] group">
        <img src={preview} alt="Chart" className="w-full object-contain max-h-80" />
        <button
          onClick={onClear}
          className="absolute top-3 right-3 w-8 h-8 bg-[#0d1117]/80 hover:bg-[#ff1744]/80 border border-[#21262d] rounded-lg flex items-center justify-center transition-all duration-200"
        >
          <X className="w-4 h-4 text-[#e6edf3]" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d1117] to-transparent p-3">
          <div className="flex items-center gap-2">
            <Image className="w-3.5 h-3.5 text-[#8b949e]" />
            <span className="text-xs text-[#8b949e] font-mono truncate">Chart uploaded — ready for analysis</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <label
      className={`flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
        ${dragging ? 'border-[#2979ff] bg-[#2979ff]/5' : 'border-[#21262d] bg-[#161b22] hover:border-[#2979ff]/50 hover:bg-[#161b22]/80'}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input type="file" className="hidden" accept="image/*" onChange={onChange} />
      <div className="flex flex-col items-center gap-3 pointer-events-none">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-200
          ${dragging ? 'bg-[#2979ff]/20' : 'bg-[#21262d]'}`}>
          <Upload className={`w-6 h-6 ${dragging ? 'text-[#2979ff]' : 'text-[#8b949e]'}`} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-[#e6edf3]">
            {dragging ? 'Drop chart here' : 'Upload chart screenshot'}
          </p>
          <p className="text-xs text-[#8b949e] mt-1">Drag & drop or click — PNG, JPG, WebP</p>
        </div>
      </div>
    </label>
  );
}
