
import React from 'react';
import { NewsSource } from '../types';

interface AdminPanelProps {
  sources: NewsSource[];
  onToggleSource: (id: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ sources, onToggleSource, onLogout, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Admin Control Panel</h2>
            <p className="text-xs text-slate-500">Manage News Portals</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 block">Select Active Portals</label>
          <div className="space-y-3 mb-8">
            {sources.map(source => (
              <div 
                key={source.id} 
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  source.enabled ? 'border-red-200 bg-red-50/50' : 'border-slate-100 hover:bg-slate-50'
                }`}
                onClick={() => onToggleSource(source.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${source.enabled ? 'bg-red-500' : 'bg-slate-300'}`} />
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{source.name}</div>
                    <div className="text-[10px] text-slate-400">{source.domain}</div>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${source.enabled ? 'bg-red-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${source.enabled ? 'left-6' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onLogout}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
            >
              Log Out
            </button>
            <button 
              onClick={onClose}
              className="flex-[2] py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-red-200"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
