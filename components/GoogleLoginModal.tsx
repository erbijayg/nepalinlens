
import React from 'react';
import { UserProfile } from '../types';

interface GoogleLoginModalProps {
  onSelect: (user: UserProfile) => void;
  onClose: () => void;
}

const MOCK_ACCOUNTS: UserProfile[] = [
  { name: 'Sagar Sharma', email: 'sagar.sharma@gmail.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sagar', interests: {} },
  { name: 'Anjali Rai', email: 'anjali.rai@yahoo.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali', interests: {} }
];

const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({ onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center border-b border-slate-100">
          <div className="flex justify-center mb-4">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Choose an account</h2>
          <p className="text-sm text-slate-500 mt-1">to continue to Nepal In Lens</p>
        </div>
        <div className="py-2">
          {MOCK_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              onClick={() => onSelect(account)}
              className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left"
            >
              <img src={account.avatar} alt={account.name} className="w-10 h-10 rounded-full border border-slate-100" />
              <div>
                <div className="text-sm font-semibold text-slate-800">{account.name}</div>
                <div className="text-xs text-slate-500">{account.email}</div>
              </div>
            </button>
          ))}
          <button className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left border-t border-slate-100">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-sm font-medium text-slate-600">Use another account</div>
          </button>
        </div>
        <div className="p-4 bg-slate-50 text-center">
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600 font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default GoogleLoginModal;
