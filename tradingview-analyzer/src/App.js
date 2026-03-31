import React, { useState } from 'react';
import { BarChart2, RefreshCw, AlertCircle, Settings, ChevronRight } from 'lucide-react';
import ApiKeyModal from './components/ApiKeyModal';
import UploadZone from './components/UploadZone';
import AnalysisPanel from './components/AnalysisPanel';
import LoadingState from './components/LoadingState';
import { analyzeChart } from './api/analyzeChart';
import './App.css';

export default function App() {
  const [apiKey, setApiKey] = useState(sessionStorage.getItem('tv_api_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(!sessionStorage.getItem('tv_api_key'));
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleApiKeySave = (key) => {
    setApiKey(key);
    sessionStorage.setItem('tv_api_key', key);
    setShowKeyModal(false);
  };

  const handleImageSelect = (imgData) => {
    setImage(imgData);
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!image || !apiKey) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeChart(image.base64, image.mimeType, apiKey);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="scan-line" />

      {showKeyModal && <ApiKeyModal onSave={handleApiKeySave} />}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0d1117]/95 backdrop-blur border-b border-[#21262d]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2979ff]/10 border border-[#2979ff]/20 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-[#2979ff]" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#e6edf3]">ChartAnalyzer</span>
              <span className="hidden sm:inline text-xs text-[#8b949e] ml-2">AI Technical Analysis</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#4285f4]/10 border border-[#4285f4]/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4285f4] animate-pulse" />
              <span className="text-xs text-[#4285f4] font-mono">Gemini 2.0 Flash</span>
            </div>
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161b22] hover:bg-[#21262d] border border-[#21262d] rounded-lg text-xs text-[#8b949e] hover:text-[#e6edf3] transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">API Key</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Upload */}
            <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-4">
              <h2 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#2979ff] rounded-full" />
                Chart Upload
              </h2>
              <UploadZone onImageSelect={handleImageSelect} preview={image?.preview} onClear={handleClear} />
            </div>

            {/* Analyze button */}
            {image && !loading && (
              <button
                onClick={handleAnalyze}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2979ff] hover:bg-[#2979ff]/90 active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-[#2979ff]/20"
              >
                <BarChart2 className="w-4 h-4" />
                Analyze Chart
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* Re-analyze */}
            {result && !loading && (
              <button
                onClick={handleAnalyze}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#21262d] text-[#8b949e] hover:text-[#e6edf3] text-sm transition-all duration-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Re-analyze
              </button>
            )}

            {/* Instructions */}
            {!image && !loading && (
              <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-4">
                <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3">How it works</h3>
                <div className="space-y-3">
                  {[
                    { step: '01', text: 'Take a screenshot of any trading chart (TradingView, MT4, etc.)' },
                    { step: '02', text: 'Upload the image by dragging it or clicking the upload zone' },
                    { step: '03', text: 'Click Analyze — Claude Vision will study every element' },
                    { step: '04', text: 'Get detailed TA with support/resistance, patterns, and trade setups' },
                  ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-md bg-[#2979ff]/10 border border-[#2979ff]/20 flex items-center justify-center text-[10px] font-mono font-bold text-[#2979ff]">{step}</span>
                      <p className="text-xs text-[#8b949e] leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="p-3 bg-[#ffd600]/5 border border-[#ffd600]/10 rounded-xl">
              <p className="text-[10px] text-[#8b949e] leading-relaxed">
                <span className="text-[#ffd600] font-semibold">Disclaimer:</span> This tool provides AI-generated analysis for educational purposes only. It is not financial advice. Always conduct your own research before making trading decisions.
              </p>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-3">
            {loading && <LoadingState />}

            {error && !loading && (
              <div className="bg-[#ff1744]/5 border border-[#ff1744]/20 rounded-xl p-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#ff1744] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#ff1744] text-sm">Analysis Failed</h3>
                  <p className="text-xs text-[#8b949e] mt-1">{error}</p>
                  <button
                    onClick={handleAnalyze}
                    className="mt-3 text-xs text-[#2979ff] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Try again
                  </button>
                </div>
              </div>
            )}

            {result && !loading && <AnalysisPanel data={result} />}

            {!result && !loading && !error && (
              <div className="h-full min-h-64 flex flex-col items-center justify-center border-2 border-dashed border-[#21262d] rounded-xl p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#21262d] flex items-center justify-center mb-4">
                  <BarChart2 className="w-8 h-8 text-[#8b949e]" />
                </div>
                <h3 className="text-sm font-semibold text-[#e6edf3] mb-1">Analysis Results</h3>
                <p className="text-xs text-[#8b949e] max-w-xs">
                  Upload a chart screenshot and click Analyze to receive detailed technical analysis powered by Claude AI.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
