import React from 'react';
import { motion } from 'motion/react';
import { History, Trash2, Mail, MessageSquare, ShieldCheck, AlertCircle } from 'lucide-react';
import { DetectionResult } from '../types';
import RiskBadge from './RiskBadge';

interface DetectionHistoryProps {
  history: DetectionResult[];
  clearHistory: () => void;
}

export default function DetectionHistory({ history, clearHistory }: DetectionHistoryProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Detection Logs</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Review previously analyzed records and forensic reports.</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Purge History
          </button>
        )}
      </header>

      {history.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-3xl text-slate-300">
          <History className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-sm font-black uppercase tracking-widest">No forensic data found</p>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Active scanners will populate this log.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-slate-300 transition-all shadow-sm group"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${item.isSafe ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                  {item.threatType === 'Phishing' || item.threatType === 'Scam' ? (
                    <Mail className="w-6 h-6" />
                  ) : item.isSafe ? (
                    <ShieldCheck className="w-6 h-6" />
                  ) : (
                    <AlertCircle className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <RiskBadge level={item.riskLevel} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {item.threatType}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-800 text-sm font-bold line-clamp-2 italic mb-1">
                    "{item.content}"
                  </p>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">
                    {item.explanation}
                  </p>
                </div>

                <div className="text-right flex flex-col justify-center">
                  <div className={`text-2xl font-black ${item.isSafe ? 'text-green-600' : 'text-red-600'}`}>
                    {item.score}%
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Threat index</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
