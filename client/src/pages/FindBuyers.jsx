import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BuyerTable from '../components/BuyerTable';
import BuyerDetailsModal from '../components/BuyerDetailsModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { buyerService } from '../services/buyerService';
import { useAuth } from '../hooks/useAuth';
import { Search, Globe2, AlertTriangle, Sparkles, Filter, RefreshCw } from 'lucide-react';

const FindBuyers = () => {
  const [niche, setNiche] = useState('Sellers of home decor items wholesale distributors');
  const [country, setCountry] = useState('United States');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [buyers, setBuyers] = useState([]);
  const [selectedModalBuyer, setSelectedModalBuyer] = useState(null);

  const { selectBuyerForOutreach } = useAuth();
  const navigate = useNavigate();

  const countries = [
    'United States',
    'United Kingdom',
    'Germany',
    'Canada',
    'Australia',
    'France',
    'UAE',
    'Netherlands',
    'Italy',
    'Spain',
    'Japan'
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!niche || !country) return;

    setLoading(true);
    setWarningMessage('');

    try {
      const res = await buyerService.searchBuyers({ niche, country, limit });
      if (res.success) {
        setBuyers(res.buyers || []);
        setIsDemo(res.isDemo || false);
        if (res.warning) {
          setWarningMessage(res.warning);
        }
      }
    } catch (err) {
      setWarningMessage(err.response?.data?.message || 'Failed to complete buyer search API call.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBuyer = (buyer) => {
    selectBuyerForOutreach(buyer);
    navigate('/outreach');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar title="Find International Buyers via API" />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Description */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Discover International Buyers via Search API</h1>
                <p className="text-xs text-slate-500 font-medium">
                  Connect to live search APIs to find verified global importers and wholesale buyers without uploading CSV files.
                </p>
              </div>
            </div>
          </div>

          {/* Search Form Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 md:p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Target Niche */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Target Buyer Niche / Product Keyword <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g. Sellers of home decor items wholesale distributors"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Example queries: <button type="button" onClick={() => setNiche('Handicraft wholesale importers')} className="text-blue-600 hover:underline">Handicraft wholesale importers</button> • <button type="button" onClick={() => setNiche('Textile and garment distributors')} className="text-blue-600 hover:underline">Textile distributors</button>
                  </p>
                </div>

                {/* Target Country */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Target Country <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-600">Results Limit:</span>
                  {[5, 10, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setLimit(num)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        limit === num
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Searching international businesses...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Find Buyers API
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Demo Mode Notice Banner */}
          {isDemo && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center space-x-3 text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">Demo Mode Active</p>
                <p className="text-xs text-amber-800">
                  Configure <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">SERPAPI_KEY</code> in Settings to trigger live SerpAPI search calls. Displaying realistic sample buyer results.
                </p>
              </div>
            </div>
          )}

          {warningMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
              {warningMessage}
            </div>
          )}

          {/* Results Section */}
          {loading ? (
            <LoadingSpinner text="Searching international businesses and extracting buyer contact emails via API..." />
          ) : buyers.length > 0 ? (
            <div className="space-y-6">
              <BuyerTable
                buyers={buyers}
                onSelectBuyer={handleSelectBuyer}
                onViewBuyer={(buyer) => setSelectedModalBuyer(buyer)}
              />
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-slate-500">
              <Globe2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Buyer Search Performed Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Enter your target buyer niche and country above, then click "Find Buyers API" to extract trade leads.
              </p>
            </div>
          )}

          {/* Buyer Details Modal */}
          <BuyerDetailsModal
            buyer={selectedModalBuyer}
            isOpen={Boolean(selectedModalBuyer)}
            onClose={() => setSelectedModalBuyer(null)}
            onSelect={handleSelectBuyer}
          />
        </main>
      </div>
    </div>
  );
};

export default FindBuyers;
