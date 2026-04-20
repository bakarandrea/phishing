import React from 'react';
import { Shield, BrainCircuit, Globe, Lock, Cpu, Server } from 'lucide-react';

export default function About() {
  const features = [
    {
      title: 'Neural Language Analysis',
      desc: 'Uses specialized NLP to detect urgency, authority spoofing, and psychological triggers common in social engineering.',
      icon: BrainCircuit,
    },
    {
      title: 'Link Forensic Engine',
      desc: 'Analyzes URL structure, TLD reputation, and hidden redirect chains to identify credential harvesting sites.',
      icon: Globe,
    },
    {
      title: 'Zero-Trust Architecture',
      desc: 'System treats every communication as potentially malicious until verified by multiple forensic vectors.',
      icon: Lock,
    },
  ];

  const specs = [
    { label: 'Detection Core', value: 'Gemini 3 Flash v1.0' },
    { label: 'NLP Framework', value: 'Google Generative AI' },
    { label: 'Interface', value: 'React / Tailwind / Motion' },
    { label: 'Institution', value: 'PythonicBoy University' },
    { label: 'Latency', value: '< 1.5s Forensic Sync' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-block w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-4 border border-slate-800">
          <Shield className="text-blue-400 w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">PythonicBoy University</h1>
        <p className="text-slate-500 max-w-xl mx-auto font-medium">
          The primary security research initiative from PythonicBoy University, 
          dedicated to neutralizing phishing and social engineering threats through 
          advanced Artificial Intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="bg-white border border-slate-200 p-8 rounded-2xl space-y-4 shadow-sm">
            <f.icon className="w-10 h-10 text-blue-600" />
            <h3 className="text-lg font-black text-slate-800 tracking-tight">{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Specifications</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-200" />
            <div className="w-2 h-2 rounded-full bg-slate-200" />
            <div className="w-2 h-2 rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {specs.map(s => (
            <div key={s.label} className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
              <span className="text-xs font-bold text-slate-900">{s.value}</span>
            </div>
          ))}
          <div className="sm:col-span-2 pt-4 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-100" />
            <Cpu className="w-5 h-5 text-blue-600" />
            <div className="flex-1 h-px bg-slate-100" />
          </div>
        </div>
      </div>

      <footer className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-10">
        SECURED BY PYTHONICBOY UNIVERSITY INFRASTRUCTURE
      </footer>
    </div>
  );
}
