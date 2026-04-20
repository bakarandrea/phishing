import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, ShieldCheck, Zap, Activity, Bug, Globe, ShieldAlert } from 'lucide-react';
import { DetectionResult } from '../types';

interface DashboardProps {
  history: DetectionResult[];
}

export default function Dashboard({ history }: DashboardProps) {
  const stats = [
    { label: 'Total Scanned', value: history.length, icon: Activity, color: 'text-blue-500', trend: '+14% from last week' },
    { label: 'Threats Blocked', value: history.filter(h => !h.isSafe).length, icon: Bug, color: 'text-red-500', trend: '2.2% infection rate' },
    { label: 'Safe Communications', value: history.filter(h => h.isSafe).length, icon: ShieldCheck, color: 'text-green-600', trend: 'Verified via ML' },
    { label: 'Avg Risk Score', value: history.length ? Math.round(history.reduce((acc, h) => acc + h.score, 0) / history.length) : 0, icon: AlertTriangle, color: 'text-amber-500', trend: 'Scikit-learn/NLP' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Security Command Center</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time threat intelligence from PythonicBoy University AI.</p>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-600 uppercase tracking-widest border border-slate-200">Admin Node v2.4</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group"
          >
            <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{stat.value}</h3>
              <p className={`text-[11px] font-medium mt-2 ${stat.color}`}>{stat.trend}</p>
            </div>
            <stat.icon className={`absolute top-6 right-6 w-8 h-8 ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Live Security Feed
            </h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Monitoring
            </span>
          </div>
          
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                <Globe className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">Waiting for data streams</p>
              </div>
            ) : (
              history.slice(0, 5).map((item, i) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200/50 transition-colors cursor-pointer">
                  <div className={`w-1.5 h-8 rounded-full ${item.isSafe ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-bold truncate">{item.content}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {item.threatType} detected • {new Date(item.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${item.isSafe ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.score}% Risk
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-3">Defense Protocols</h3>
            <ul className="space-y-4">
              {[
                { label: 'Neural Text Analysis', status: 'Optimal' },
                { label: 'Deep URL Inspection', status: 'Shielded' },
                { label: 'Psychological Heuristics', status: 'Engaged' },
                { label: 'Global Threat Database', status: 'Synced' },
              ].map(p => (
                <li key={p.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">{p.label}</span>
                  <span className="text-[10px] font-black text-green-600 uppercase border border-green-200 bg-green-50 px-1.5 py-0.5 rounded">{p.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <ShieldAlert className="w-12 h-12 text-blue-400" />
             </div>
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Protocol Warning</h3>
            <p className="text-xs text-slate-400 items-center gap-2 leading-relaxed">
              Automated interceptors are active. All detected anomalies are logged to the university forensics database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
