import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBidsForGig, hireBid } from '../store/slices/bidsSlice';
import { getSocket } from '../services/socket';
import api from '../services/api';

const GigBids = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bids, isLoading, error } = useSelector((state) => state.bids);
  const [gig, setGig] = useState(null);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await api.get(`/gigs/${id}`);
        setGig(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGig();
    dispatch(fetchBidsForGig(id));
  }, [dispatch, id]);

  useEffect(() => {
    const socket = getSocket();
    
    if (socket) {
      const handleNewBid = (newBid) => {
        if (newBid.gigId === id) {
          dispatch(fetchBidsForGig(id));
        }
      };

      socket.on('new-bid', handleNewBid);

      return () => {
        socket.off('new-bid', handleNewBid);
      };
    }
  }, [id, dispatch]);

  const handleHire = async (bidId) => {
    if (window.confirm('Are you sure you want to hire this freelancer? This action cannot be undone.')) {
      const result = await dispatch(hireBid(bidId));
      if (result.type === 'bids/hireBid/fulfilled') {
        alert('Freelancer hired successfully!');
        dispatch(fetchBidsForGig(id));
        const response = await api.get(`/gigs/${id}`);
        setGig(response.data.data);
      }
    }
  };

  if (isLoading && !gig) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pastel-blue via-pastel-lavender to-pastel-pink">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pastel-purple border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading bids...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-mint via-white to-pastel-blue">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/my-gigs')}
          className="mb-6 text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-2 transition-all hover:gap-3"
        >
          ← Back to My Jobs
        </button>

        {gig && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 hover:shadow-2xl transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-display font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {gig.title}
                </h1>
                <p className="text-xl text-gray-700 font-medium">Budget: <span className="text-green-600 font-bold">${gig.budget}</span></p>
              </div>
              <span
                className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md ${
                  gig.status === 'open'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                    : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                }`}
              >
                {gig.status === 'open' ? '🟢 Open' : '✅ Assigned'}
              </span>
            </div>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-display font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Bids Received ({bids.length})
          </h2>

          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-md">
              {error}
            </div>
          )}

          {bids.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-pastel-lavender rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xl text-gray-600 font-medium">No bids submitted yet</p>
              <p className="text-gray-500 mt-2">Waiting for freelancers to submit their proposals</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bids.map((bid) => (
                <div
                  key={bid._id}
                  className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${
                    bid.status === 'hired'
                      ? 'border-green-400 bg-green-50/50'
                      : bid.status === 'rejected'
                      ? 'border-red-300 bg-red-50/50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-display font-bold text-2xl text-gray-800">{bid.freelancer?.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{bid.freelancer?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-green-600">${bid.price}</p>
                      <span
                        className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mt-2 shadow-sm ${
                          bid.status === 'hired'
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                            : bid.status === 'rejected'
                            ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                            : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                        }`}
                      >
                        {bid.status === 'hired'
                          ? '✅ Hired'
                          : bid.status === 'rejected'
                          ? '❌ Rejected'
                          : '⏳ Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Proposal Message</p>
                    <p className="text-gray-700 whitespace-pre-wrap bg-pastel-lavender/30 p-4 rounded-xl leading-relaxed">{bid.message}</p>
                  </div>

                  {bid.status === 'pending' && gig?.status === 'open' && (
                    <button
                      onClick={() => handleHire(bid._id)}
                      disabled={isLoading}
                      className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-all hover:shadow-xl hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Hiring...' : '🎉 Hire This Freelancer'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigBids;
