import React from 'react';
import { X, ExternalLink, CheckCircle2, AlertTriangle, Send, Building2, Globe, Mail, MapPin } from 'lucide-react';

const BuyerDetailsModal = ({ buyer, isOpen, onClose, onSelect }) => {
  if (!isOpen || !buyer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20">
                {buyer.industry || 'Wholesale Buyer'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300">
                {buyer.country}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{buyer.companyName}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Email Card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-blue-100 text-blue-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Contact Email</p>
                <p className="text-sm font-bold text-slate-900">{buyer.email}</p>
              </div>
            </div>

            {buyer.emailVerified ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Estimated
              </span>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500 flex items-center mb-1">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> Target Country
              </span>
              <p className="font-bold text-slate-900">{buyer.country}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500 flex items-center mb-1">
                <Globe className="w-3.5 h-3.5 mr-1 text-slate-400" /> Website URL
              </span>
              {buyer.website ? (
                <a
                  href={buyer.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline flex items-center truncate"
                >
                  <span className="truncate">{buyer.website}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 shrink-0" />
                </a>
              ) : (
                <p className="text-slate-400 italic">Not available</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Company Overview</h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {buyer.description || 'Discovered international buyer looking for global trade suppliers and direct factory partnerships.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onSelect(buyer);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors flex items-center shadow-md shadow-blue-500/20"
          >
            <Send className="w-4 h-4 mr-2" />
            Select Buyer for Outreach
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerDetailsModal;
