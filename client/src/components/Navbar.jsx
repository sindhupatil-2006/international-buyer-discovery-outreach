import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api';
import { Globe, User, ShieldCheck, AlertTriangle, XCircle, Send } from 'lucide-react';

const Navbar = ({ title }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [apiStatus, setApiStatus] = useState({ loading: true, demoMode: true, configured: false, error: false });

  useEffect(() => {
    fetchApiStatus();
  }, []);

  const fetchApiStatus = async () => {
    try {
      const res = await API.get('/buyers/api-status');
      setApiStatus({
        loading: false,
        demoMode: Boolean(res.data?.demoMode),
        configured: Boolean(res.data?.configured),
        error: false
      });
    } catch (err) {
      setApiStatus({ loading: false, demoMode: true, configured: false, error: true });
    }
  };

  const getPageTitle = () => {
    if (title) return title;
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard Overview';
    if (path.includes('find-buyers')) return 'Find International Buyers via API';
    if (path.includes('buyers')) return 'Discovered International Buyers';
    if (path.includes('outreach')) return 'Email Outreach Desk';
    if (path.includes('history')) return 'Outreach History Log';
    if (path.includes('settings')) return 'System Settings & API Keys';
    if (path.includes('profile')) return 'Exporter Profile';
    return 'Buyer Discovery Desk';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{getPageTitle()}</h2>
        
        {/* Step 6 & 13: Truthful Status Badge */}
        {apiStatus.loading ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Checking status...
          </span>
        ) : apiStatus.error ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            API Error
          </span>
        ) : apiStatus.demoMode ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Demo Mode
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Live API Connected
          </span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <Link
          to="/find-buyers"
          className="inline-flex items-center px-3.5 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs transition-colors"
        >
          <Globe className="w-4 h-4 mr-1.5" />
          New API Search
        </Link>

        <Link
          to="/outreach"
          className="inline-flex items-center px-3.5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Send className="w-4 h-4 mr-1.5" />
          Quick Outreach
        </Link>

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="flex items-center space-x-3 pl-2">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-500 font-medium">{user?.companyName || 'Export Manager'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
