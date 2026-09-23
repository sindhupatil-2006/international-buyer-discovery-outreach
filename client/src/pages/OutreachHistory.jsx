import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { outreachService } from '../services/outreachService';
import {
  History,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Trash2,
  Eye,
  Paperclip,
  X
} from 'lucide-react';

const OutreachHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await outreachService.getOutreachHistory();
      if (res.success) {
        setHistory(res.outreach || []);
      }
    } catch (err) {
      console.error('Failed to fetch outreach history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this outreach record?')) return;
    try {
      const res = await outreachService.deleteOutreach(id);
      if (res.success) {
        setHistory((prev) => prev.filter((o) => o.id !== id));
      }
    } catch (err) {
      alert('Failed to delete outreach log record');
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar title="Outreach History Log" />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Outreach Email Audit History</h1>
              <p className="text-xs text-slate-500 font-medium">
                Complete log of all dispatched trade inquiry emails and Nodemailer SMTP delivery receipts
              </p>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading outreach audit logs..." />
          ) : history.length === 0 ? (
            <EmptyState
              icon={History}
              title="No Email Outreach Dispatched Yet"
              description="Select a buyer from Find Buyers or Buyer Directory to start sending B2B export proposals."
            />
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
              {/* Filter Toolbar */}
              <div className="p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-700">
                  Total Logs: {filteredHistory.length}
                </p>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search company or subject..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none w-56 shadow-sm"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Sent">Sent</option>
                    <option value="Failed">Failed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Log Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-6">Dispatched Date</th>
                      <th className="py-3.5 px-6">Company Name</th>
                      <th className="py-3.5 px-6">Recipient Email</th>
                      <th className="py-3.5 px-6">Subject</th>
                      <th className="py-3.5 px-6">Attachment</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 text-sm">
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 text-xs text-slate-500 font-medium whitespace-nowrap">
                          {new Date(item.sentAt || item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">{item.companyName}</td>
                        <td className="py-4 px-6 font-mono text-xs text-slate-700">{item.recipientEmail}</td>
                        <td className="py-4 px-6 max-w-xs text-xs text-slate-800 truncate font-medium">
                          {item.subject}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500">
                          {item.attachmentName ? (
                            <span className="inline-flex items-center text-blue-600 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                              <Paperclip className="w-3 h-3 mr-1" />
                              {item.attachmentName}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {item.status === 'Sent' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                              <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedRecord(item)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="View Log Message"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Log"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Log Detail Modal */}
          {selectedRecord && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-lg text-slate-900">Outreach Email Details</h3>
                  <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xs space-y-2 text-slate-600">
                  <p><strong>To:</strong> {selectedRecord.recipientEmail} ({selectedRecord.companyName})</p>
                  <p><strong>Subject:</strong> {selectedRecord.subject}</p>
                  <p><strong>Date:</strong> {new Date(selectedRecord.sentAt || selectedRecord.createdAt).toLocaleString()}</p>
                  <p><strong>Status:</strong> {selectedRecord.status}</p>
                  {selectedRecord.errorMessage && (
                    <p className="text-rose-600 font-medium"><strong>Error:</strong> {selectedRecord.errorMessage}</p>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Email Body Content:</h4>
                  <div className="bg-slate-50 p-4 rounded-xl border text-xs leading-relaxed whitespace-pre-line text-slate-800">
                    {selectedRecord.body}
                  </div>
                </div>

                <div className="text-right pt-2">
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                  >
                    Close Log
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OutreachHistory;
