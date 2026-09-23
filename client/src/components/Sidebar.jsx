import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Search,
  Globe2,
  Send,
  History,
  Settings,
  User,
  LogOut,
  Building2,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Buyers', path: '/find-buyers', icon: Search, badge: 'API' },
    { name: 'Buyers Directory', path: '/buyers', icon: Globe2 },
    { name: 'Email Outreach', path: '/outreach', icon: Send },
    { name: 'Outreach History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Globe2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white leading-tight">Global Trade Desk</h1>
          <p className="text-[11px] font-medium text-slate-400">Buyer Discovery & Outreach</p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/20">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Exporter Desk Summary & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-800/40 mb-3 border border-slate-700/50">
          <div className="w-8 h-8 rounded-lg bg-blue-900/60 text-blue-300 flex items-center justify-center font-bold text-xs uppercase">
            {user?.name?.charAt(0) || 'E'}
          </div>
          <div className="truncate flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Exporter Desk'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.companyName || user?.email || 'Global Supplier'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
