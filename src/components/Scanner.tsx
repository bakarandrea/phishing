import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, AlertCircle, CheckCircle2, ListFilter, Fingerprint, ShieldAlert } from 'lucide-react';
import { analyzeContent } from '../services/geminiService';
import { DetectionResult } from '../types';
import RiskBadge from './RiskBadge';

interface ScannerProps {
  onResult: (result: DetectionResult) => void;
}

export default function Scanner({ onResult }: ScannerProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeContent(content);
      setResult(data);
      onResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Manual Content Inspection</h2>
        <p className="text-slate-500 text-sm mt-1">Paste the message content here for deep NLP analysis from the PythonicBoy engine.</p>
      </header>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wider">Email / SMS Payload</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the message content here for NLP analysis..."
            className="w-full h-48 bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-sans leading-relaxed resize-none text-sm"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setContent('')}
              className="px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading || !content.trim()}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  ANALYZING...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  RUN AI SCAN
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <div className={`lg:col-span-8 rounded-xl p-8 border ${result.isSafe ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-lg ${result.isSafe ? 'bg-green-100' : 'bg-red-100'}`}>
                  {result.isSafe ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <ShieldAlert className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className={`text-lg font-black uppercase tracking-tight ${result.isSafe ? 'text-green-700' : 'text-red-700'}`}>
                    {result.isSafe ? 'Verified Legitimate' : 'Threat Intelligence Alert'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <RiskBadge level={result.riskLevel} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{result.threatType}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium italic bg-white/40 p-4 rounded-lg border border-slate-200/50">
                    "{result.explanation}"
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ListFilter className="w-4 h-4 text-slate-400" />
                    Suspicious Indicators Identified
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.suspiciousElements.map((el, i) => (
                      <li key={i} className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded shadow-sm">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-600 font-medium">{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Threat Confidence</p>
                <div className="text-5xl font-black text-slate-900">{result.score}%</div>
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score}%` }}
                    className={`h-full ${result.isSafe ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Fingerprint className="w-3 h-3 text-slate-400" />
                  Forensic Signature
                </h4>
                <p className="text-[10px] font-mono text-slate-500 break-all bg-white p-2 rounded border border-slate-200">{result.id}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-tighter">TIMESTAMP: {new Date(result.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
