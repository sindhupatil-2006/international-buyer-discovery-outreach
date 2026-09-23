import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-slate-600">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100 animate-spin border-t-blue-600"></div>
      </div>
      {text && <p className="text-sm font-medium text-slate-600 animate-pulse-subtle">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
