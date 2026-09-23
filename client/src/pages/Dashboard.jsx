import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../hooks/useAuth';
import {
  Globe2,
  Send,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { selectBuyerForOutreach } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getStats();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setError('Failed to load dashboard metrics.');
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
        <Navbar title="Exporter Dashboard" />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Action Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>API Real-time Trade Desk</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Global Buyer Discovery & Outreach Desk
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
                Discover international buyers through search APIs and send personalized B2B outreach emails directly.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <Link
                to="/find-buyers"
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Find New Buyers
              </Link>
              <Link
                to="/outreach"
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Outreach
              </Link>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Computing real-time database stats..." />
          ) : error ? (
            <div className="p-6 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-sm">
              {error}
            </div>
          ) : (
            <>
              {/* Metric Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatsCard
                  title="Total Buyers"
                  value={data.stats.totalBuyers}
                  icon={Globe2}
                  color="blue"
                  subtitle="Discovered via API"
                />
                <StatsCard
                  title="Total Outreach"
                  value={data.stats.totalOutreach}
                  icon={Send}
                  color="indigo"
                  subtitle="Emails dispatched"
                />
                <StatsCard
                  title="Sent Today"
                  value={data.stats.sentToday}
                  icon={Calendar}
                  color="purple"
                  subtitle="Active outreach"
                />
                <StatsCard
                  title="Searches"
                  value={data.stats.totalSearches}
                  icon={Search}
                  color="amber"
                  subtitle="Queries run"
                />
                <StatsCard
                  title="Successful"
                  value={data.stats.successfulOutreach}
                  icon={CheckCircle2}
                  color="emerald"
                  subtitle="Delivered outreach"
                />
                <StatsCard
                  title="Failed"
                  value={data.stats.failedOutreach}
                  icon={XCircle}
                  color="rose"
                  subtitle="SMTP exceptions"
                />
              </div>

              {/* Grid Feed: Recent Discoveries & Outreach Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Buyer Discoveries */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Globe2 className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base text-slate-900">Recent Discovered Buyers</h3>
                    </div>
                    <Link to="/buyers" className="text-xs font-bold text-blue-600 hover:underline flex items-center">
                      View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>

                  {data.recentBuyers.length === 0 ? (
                    <p className="text-sm text-slate-500 italic text-center py-8">
                      No buyers discovered yet. Run your first search query!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {data.recentBuyers.map((buyer) => (
                        <div
                          key={buyer.id}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/60 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-900">{buyer.companyName}</p>
                            <p className="text-xs font-mono text-slate-600">{buyer.email}</p>
                            <span className="inline-block mt-1 text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                              {buyer.country}
                            </span>
                          </div>
                          <button
                            onClick={() => handleSelectBuyer(buyer)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center shadow-sm shrink-0"
                          >
                            <Send className="w-3.5 h-3.5 mr-1" /> Outreach
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Outreach Activity */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <Send className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base text-slate-900">Recent Outreach History</h3>
                    </div>
                    <Link to="/history" className="text-xs font-bold text-blue-600 hover:underline flex items-center">
                      View Logs <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>

                  {data.recentOutreach.length === 0 ? (
                    <p className="text-sm text-slate-500 italic text-center py-8">
                      No email outreach dispatched yet. Select a buyer to send your first pitch!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {data.recentOutreach.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/60"
                        >
                          <div className="truncate max-w-xs">
                            <p className="text-sm font-bold text-slate-900 truncate">{item.companyName}</p>
                            <p className="text-xs text-slate-600 truncate">{item.subject}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {new Date(item.sentAt || item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              item.status === 'Sent'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
