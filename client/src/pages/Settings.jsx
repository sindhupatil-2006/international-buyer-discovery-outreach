import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { settingsService } from '../services/settingsService';
import { Settings as SettingsIcon, Key, Mail, ShieldCheck, Save, Info, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const [formData, setFormData] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    smtpUser: '',
    smtpFrom: '',
    serpapiKey: '',
    geminiApiKey: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [systemStatus, setSystemStatus] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSettings();
      if (res.success && res.settings) {
        setFormData({
          smtpHost: res.settings.smtpHost || 'smtp.gmail.com',
          smtpPort: res.settings.smtpPort || 465,
          smtpUser: res.settings.smtpUser || '',
          smtpFrom: res.settings.smtpFrom || '',
          serpapiKey: res.settings.serpapiKeyMasked || '',
          geminiApiKey: res.settings.geminiApiKeyMasked || ''
        });
        setSystemStatus({
          hasCustomSmtp: res.settings.hasCustomSmtp,
          hasCustomSerpApi: res.settings.hasCustomSerpApi,
          hasCustomGemini: res.settings.hasCustomGemini,
          systemSmtpConfigured: res.settings.systemSmtpConfigured,
          systemSerpApiConfigured: res.settings.systemSerpApiConfigured,
          systemGeminiConfigured: res.settings.systemGeminiConfigured
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await settingsService.updateSettings(formData);
      if (res.success) {
        setToast({ type: 'success', message: 'System configuration settings updated successfully!' });
        fetchSettings();
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update system settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar title="System Settings & API Keys" />

        <main className="p-8 max-w-4xl mx-auto w-full space-y-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Portal & External API Settings</h1>
              <p className="text-xs text-slate-500 font-medium">
                Configure Nodemailer SMTP credentials, SerpAPI search key, and Google Gemini AI key
              </p>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching system configuration parameters..." />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* API Credentials Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-6">
                  <Key className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base text-slate-900">External API Integrations</h3>
                </div>

                <div className="space-y-6">
                  {/* SerpAPI Key */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      SerpAPI Search Key (<code className="text-blue-600 font-mono">SERPAPI_KEY</code>)
                    </label>
                    <input
                      type="password"
                      name="serpapiKey"
                      value={formData.serpapiKey}
                      onChange={handleChange}
                      placeholder="Enter SerpAPI key for live Google Search buyer discovery"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                    <p className="mt-1.5 text-[11px] text-slate-500 flex items-center">
                      <Info className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      If left blank, application automatically runs in safe Demo Mode with realistic curated buyer data.
                    </p>
                  </div>

                  {/* Gemini API Key */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Google Gemini AI Key (<code className="text-blue-600 font-mono">GEMINI_API_KEY</code>)
                    </label>
                    <input
                      type="password"
                      name="geminiApiKey"
                      value={formData.geminiApiKey}
                      onChange={handleChange}
                      placeholder="Enter Gemini API key for AI email pitch generation"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                    <p className="mt-1.5 text-[11px] text-slate-500 flex items-center">
                      <Info className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      If left blank, application uses high-converting B2B copywriting templates.
                    </p>
                  </div>
                </div>
              </div>

              {/* SMTP Credentials Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-4 mb-6">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-base text-slate-900">Email Outreach SMTP Server Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      name="smtpHost"
                      value={formData.smtpHost}
                      onChange={handleChange}
                      placeholder="smtp.gmail.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      name="smtpPort"
                      value={formData.smtpPort}
                      onChange={handleChange}
                      placeholder="465"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      SMTP User / Gmail Address
                    </label>
                    <input
                      type="text"
                      name="smtpUser"
                      value={formData.smtpUser}
                      onChange={handleChange}
                      placeholder="exporter@gmail.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Sender From Email Header
                    </label>
                    <input
                      type="email"
                      name="smtpFrom"
                      value={formData.smtpFrom}
                      onChange={handleChange}
                      placeholder="export-desk@company.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving Settings...' : 'Save Configuration Settings'}
                </button>
              </div>
            </form>
          )}

          {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        </main>
      </div>
    </div>
  );
};

export default Settings;
