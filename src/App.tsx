import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import URLScanner from './components/URLScanner';
import DetectionHistory from './components/DetectionHistory';
import About from './components/About';
import { DetectionResult } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [history, setHistory] = useState<DetectionResult[]>([]);

  // Load history from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('phishing_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const addDetection = async (result: DetectionResult) => {
    const newHistory = [result, ...history];
    setHistory(newHistory);
    localStorage.setItem('phishing_history', JSON.stringify(newHistory));

    // Trigger Real-time Alert if it's a threat
    if (!result.isSafe) {
      try {
        await fetch('/api/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ detection: result }),
        });
      } catch (error) {
        console.error('Failed to trigger alert:', error);
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('phishing_history');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard history={history} />;
      case 'scanner':
        return <Scanner onResult={addDetection} />;
      case 'url':
        return <URLScanner onResult={addDetection} />;
      case 'history':
        return <DetectionHistory history={history} clearHistory={clearHistory} />;
      case 'about':
        return <About />;
      default:
        return <Dashboard history={history} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600/20 selection:text-blue-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto h-screen custom-scrollbar">
        {/* Sub-header for Phishing Detection Center */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
           <h2 className="text-lg font-bold text-slate-800 tracking-tight">Phishing Detection Center</h2>
           <div className="flex items-center space-x-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin Node PB-01</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-black text-blue-400 text-[10px] shadow-sm">PB</div>
           </div>
        </header>

        <div className="max-w-7xl mx-auto px-8 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
