import React from 'react';
import { Shield, LayoutDashboard, Search, Link2, History, Info, Terminal } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'scanner', icon: Search, label: 'Text Analysis' },
    { id: 'url', icon: Link2, label: 'URL Scanner' },
    { id: 'history', icon: History, label: 'Detection History' },
    { id: 'about', icon: Info, label: 'System Info' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-lg font-bold tracking-tight text-blue-400 uppercase">PYTHONICBOY</h1>
        <p className="text-xs text-slate-400 font-medium">University Security Lab</p>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2 text-slate-400 uppercase tracking-tighter text-[10px] font-bold">
            <Terminal className="w-3 h-3 text-blue-400" />
            <span>System Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-sm font-bold text-green-400">ML Model Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
