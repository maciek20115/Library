import React, { useState } from 'react';
import { Key, Eye, EyeOff, Shield, ExternalLink } from 'lucide-react';

export default function ApiKeyModal({ onSave }) {
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key.trim().length > 10) onSave(key.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#161b22] border border-[#21262d] rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#4285f4]/10 border border-[#4285f4]/20 flex items-center justify-center">
            <Key className="w-5 h-5 text-[#4285f4]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#e6edf3]">Google Gemini API Key</h2>
            <p className="text-xs text-[#8b949e]">Wymagany do analizy AI — darmowy tier dostępny</p>
          </div>
        </div>

        <div className="mb-5 p-3 bg-[#4285f4]/5 border border-[#4285f4]/15 rounded-lg flex items-center justify-between">
          <span className="text-xs font-mono text-[#4285f4]">gemini-2.0-flash</span>
          <span className="text-xs text-[#8b949e]">15 req/min · bezpłatny</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIza..."
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-lg px-4 py-3 text-sm text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#4285f4] pr-12 font-mono"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-[#e6edf3] transition-colors"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#4285f4] hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Pobierz darmowy klucz na aistudio.google.com
          </a>

          <div className="flex items-start gap-2 p-3 bg-[#0d1117] rounded-lg border border-[#21262d]">
            <Shield className="w-4 h-4 text-[#8b949e] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[#8b949e]">
              Klucz przechowywany tylko w pamięci przeglądarki — nie trafia na żaden serwer poza Google API.
            </p>
          </div>

          <button
            type="submit"
            disabled={key.trim().length <= 10}
            className="w-full bg-[#4285f4] hover:bg-[#4285f4]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all duration-200 text-sm"
          >
            Start Analyzing
          </button>
        </form>
      </div>
    </div>
  );
}
