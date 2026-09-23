import React from 'react';
import { Search, Inbox, ArrowRight } from 'lucide-react';

const EmptyState = ({ icon: Icon = Search, title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200/80 rounded-2xl shadow-sm my-4">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          {actionText}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      )}
    </div>
  );
};

export default EmptyState;
