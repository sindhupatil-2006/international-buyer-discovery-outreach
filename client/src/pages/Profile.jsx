import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { User, Building2, Mail, Calendar, ShieldCheck, Globe2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar title="Exporter Profile" />

        <main className="p-8 max-w-4xl mx-auto w-full space-y-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Exporter Account Profile</h1>
              <p className="text-xs text-slate-500 font-medium">
                Manage your exporter trade account details and organization parameters
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm space-y-6">
            <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-500/20">
                {user?.name?.charAt(0) || 'E'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Exporter User'}</h2>
                <p className="text-xs text-slate-500 font-medium">{user?.companyName || 'Global Supply Desk'}</p>
                <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Exporter Account
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-500 flex items-center mb-1">
                  <User className="w-4 h-4 mr-1.5 text-blue-600" /> Full Name
                </span>
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-500 flex items-center mb-1">
                  <Mail className="w-4 h-4 mr-1.5 text-blue-600" /> Business Email Address
                </span>
                <p className="text-sm font-bold text-slate-900 font-mono">{user?.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-500 flex items-center mb-1">
                  <Building2 className="w-4 h-4 mr-1.5 text-blue-600" /> Company / Organization Name
                </span>
                <p className="text-sm font-bold text-slate-900">{user?.companyName || 'Export Division'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-500 flex items-center mb-1">
                  <Calendar className="w-4 h-4 mr-1.5 text-blue-600" /> Account Registration Date
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Session'}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
