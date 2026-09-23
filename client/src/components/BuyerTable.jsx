import React, { useState } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Search,
  Filter,
  Globe2,
  Trash2
} from 'lucide-react';

const BuyerTable = ({ buyers = [], onSelectBuyer, onViewBuyer, onDeleteBuyer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');

  const countries = Array.from(new Set(buyers.map((b) => b.country))).filter(Boolean);

  const filteredBuyers = buyers.filter((buyer) => {
    const matchesSearch =
      (buyer.companyName && buyer.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (buyer.email && buyer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (buyer.description && buyer.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCountry = selectedCountry === 'ALL' || buyer.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Discovered International Buyers</h3>
            <p className="text-xs text-slate-500 font-medium">
              Showing {filteredBuyers.length} of {buyers.length} discovered companies
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none w-56 shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            >
              <option value="ALL">All Countries ({buyers.length})</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-6">Company Name</th>
              <th className="py-3.5 px-6">Buyer Email</th>
              <th className="py-3.5 px-6">Country</th>
              <th className="py-3.5 px-6">Description / Details</th>
              <th className="py-3.5 px-6">Verification</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 text-sm">
            {filteredBuyers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-500">
                  <p className="text-sm font-medium">No buyer records match your criteria.</p>
                </td>
              </tr>
            ) : (
              filteredBuyers.map((buyer, idx) => (
                <tr key={buyer.id || buyer.email || `buyer-${idx}`} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    <div className="flex flex-col">
                      <span>{buyer.companyName}</span>
                      {buyer.website && (
                        <a
                          href={buyer.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-medium text-blue-600 hover:underline inline-flex items-center mt-0.5"
                        >
                          {buyer.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Step 9 & 4: Display Real Email or "Email not found" */}
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    {buyer.email ? (
                      <span className="font-mono text-xs text-slate-900">{buyer.email}</span>
                    ) : (
                      <span className="text-slate-400 italic text-xs font-medium bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        Email not found
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {buyer.country}
                    </span>
                  </td>

                  <td className="py-4 px-6 max-w-xs text-xs text-slate-600 truncate">
                    {buyer.description || 'International buyer discovered via search API'}
                  </td>

                  <td className="py-4 px-6">
                    {!buyer.email ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                        Not Available
                      </span>
                    ) : buyer.emailVerified ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Estimated
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {onViewBuyer && (
                        <button
                          onClick={() => onViewBuyer(buyer)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {onSelectBuyer && (
                        <button
                          onClick={() => onSelectBuyer(buyer)}
                          className="inline-flex items-center px-3 py-1.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          Select
                        </button>
                      )}

                      {onDeleteBuyer && buyer.id && (
                        <button
                          onClick={() => onDeleteBuyer(buyer.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Buyer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuyerTable;
