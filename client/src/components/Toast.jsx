import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900 icon-emerald-600',
    error: 'bg-rose-50 border-rose-200 text-rose-900 icon-rose-600',
    info: 'bg-blue-50 border-blue-200 text-blue-900 icon-blue-600',
    warning: 'bg-amber-50 border-amber-200 text-amber-900 icon-amber-600'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center p-4 max-w-md border rounded-xl shadow-lg transition-all animate-bounce-short ${styles[type] || styles.info}`}>
      {icons[type]}
      <p className="ml-3 text-sm font-medium leading-relaxed">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
