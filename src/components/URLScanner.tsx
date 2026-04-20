import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link2, Loader2, ShieldCheck, ShieldX, ExternalLink, Info } from 'lucide-react';
import { analyzeUrl } from '../services/geminiService';
import { URLAnalysis } from '../types';
import RiskBadge from './RiskBadge';

interface URLScannerProps {
  onResult: (result: any) => void;
}

export default function URLScanner({ onResult }: URLScannerProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<URLAnalysis | null>(null);

  const handleScan = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeUrl(url);
      setResult(data);
      // Map URL analysis to a history item format
      onResult({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        content: `URL Scan: ${url}`,
        riskLevel: data.riskLevel,
        threatType: data.isMalicious ? 'Malware' : 'Legitimate',
        explanation: data.recommendation,
        suspiciousElements: data.reasons,
        isSafe: !data.isMalicious,
        score: data.isMalicious ? 90 : 5,
      });
    } catch (error) {
      console.error('URL Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Rapid URL Interceptor</h2>
        <p className="text-slate-500 text-sm mt-1">Scan suspicious links before clicking to prevent credential theft.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example-phish.com/verify..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
            />
          </div>
          <button
            onClick={handleScan}
            disabled={loading || !url.trim()}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg whitespace-nowrap text-sm"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'SCAN LINK'
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl border p-8 ${result.isMalicious ? 'bg-red-50/50 border-red-200' : 'bg-green-50/50 border-green-200'}`}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className={`p-5 rounded-2xl ${result.isMalicious ? 'bg-red-100' : 'bg-green-100'}`}>
                {result.isMalicious ? (
                  <ShieldX className="w-12 h-12 text-red-600" />
                ) : (
                  <ShieldCheck className="w-12 h-12 text-green-600" />
                )}
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h3 className={`text-2xl font-black uppercase tracking-tight ${result.isMalicious ? 'text-red-700' : 'text-green-700'}`}>
                      {result.isMalicious ? 'DANGER DETECTED' : 'VERIFIED SAFE LINK'}
                    </h3>
                    <RiskBadge level={result.riskLevel} />
                  </div>
                  <p className="text-slate-600 font-mono text-xs bg-white py-2 px-3 rounded inline-block border border-slate-200">
                    {result.url}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Info className="w-3 h-3 text-slate-400" />
                      Analysis Findings
                    </h4>
                    <ul className="space-y-2">
                      {result.reasons.map((r, i) => (
                        <li key={i} className="text-xs text-slate-600 font-medium flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/60 p-4 rounded-xl border border-slate-200">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Recommendation</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {result.recommendation}
                    </p>
                  </div>
                </div>

                {!result.isMalicious && (
                  <div className="pt-4">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-green-600 hover:text-green-700 transition-colors uppercase tracking-widest"
                    >
                      Safe to proceed <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: 'Typosquatting Check', desc: 'Checks for visual domain impersonation.' },
          { title: 'URL Shortener Decryption', desc: 'Analyzes the final destination of redirects.' },
          { title: 'Metadata Verification', desc: 'Inspects SSL and domain registration age.' },
        ].map(item => (
          <div key={item.title} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.title}</h5>
            <p className="text-[11px] text-slate-600 font-medium">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
