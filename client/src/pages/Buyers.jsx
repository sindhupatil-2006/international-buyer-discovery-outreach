import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BuyerTable from '../components/BuyerTable';
import BuyerDetailsModal from '../components/BuyerDetailsModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { buyerService } from '../services/buyerService';
import { useAuth } from '../hooks/useAuth';
import { Globe2, Search, Plus } from 'lucide-react';

const Buyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModalBuyer, setSelectedModalBuyer] = useState(null);

  const { selectBuyerForOutreach } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const res = await buyerService.getBuyers();
      if (res.success) {
        setBuyers(res.buyers || []);
      }
    } catch (err) {
      console.error('Failed to fetch buyers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBuyer = (buyer) => {
    selectBuyerForOutreach(buyer);
    navigate('/outreach');
  };

  const handleDeleteBuyer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this buyer record?')) return;
    try {
      const res = await buyerService.deleteBuyer(id);
      if (res.success) {
        setBuyers((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      alert('Failed to delete buyer');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar title="Discovered International Buyers Directory" />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Discovered Buyer Directory</h1>
              <p className="text-xs text-slate-500 font-medium">
                Manage all discovered international trade partners and select buyers for email outreach
              </p>
            </div>

            <button
              onClick={() => navigate('/find-buyers')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Discover New Buyers
            </button>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching discovered buyer database records..." />
          ) : buyers.length === 0 ? (
            <EmptyState
              icon={Globe2}
              title="No Buyers Discovered Yet"
              description="Run an API search query in Find Buyers to discover wholesale companies and import leads."
              actionText="Find Buyers API"
              onAction={() => navigate('/find-buyers')}
            />
          ) : (
            <BuyerTable
              buyers={buyers}
              onSelectBuyer={handleSelectBuyer}
              onViewBuyer={(buyer) => setSelectedModalBuyer(buyer)}
              onDeleteBuyer={handleDeleteBuyer}
            />
          )}

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

export default Buyers;
