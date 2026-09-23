import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import OutreachForm from '../components/OutreachForm';
import { useAuth } from '../hooks/useAuth';
import { Send, Globe2, ArrowLeft } from 'lucide-react';

const Outreach = () => {
  const { selectedBuyer } = useAuth();
  const navigate = useNavigate();

  const handleOutreachSuccess = (result) => {
    setTimeout(() => {
      navigate('/history');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar title="Email Outreach Desk" />

        <main className="p-8 max-w-5xl mx-auto w-full space-y-8">
          {/* Header Back Banner */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/buyers')}
              className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Buyers Directory
            </button>

            {selectedBuyer && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Globe2 className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Active Buyer: {selectedBuyer.companyName}
              </span>
            )}
          </div>

          <OutreachForm
            initialBuyer={selectedBuyer}
            onSuccess={handleOutreachSuccess}
          />
        </main>
      </div>
    </div>
  );
};

export default Outreach;
