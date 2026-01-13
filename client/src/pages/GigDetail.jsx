import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitBid } from '../store/slices/bidsSlice';
import api from '../services/api';

const GigDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isLoading, error } = useSelector((state) => state.bids);
  
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    message: '',
    price: ''
  });

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await api.get(`/gigs/${id}`);
        setGig(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(submitBid({
      gigId: id,
      message: bidData.message,
      price: parseFloat(bidData.price)
    }));

    if (result.type === 'bids/submitBid/fulfilled') {
      alert('Bid submitted successfully!');
      navigate('/my-bids');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Job not found</div>
      </div>
    );
  }

  const isOwner = user && user._id === gig.owner?._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-white to-pastel-lavender py-12">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
            <div className="mb-6">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                  gig.status === 'open'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {gig.status === 'open' ? '🟢 Open' : '✅ Assigned'}
              </span>
              <h1 className="text-3xl font-bold mb-2">{gig.title}</h1>
              <p className="text-gray-600">Posted by {gig.owner?.name}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{gig.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Budget</h2>
              <p className="text-3xl font-bold text-green-600">${gig.budget}</p>
            </div>

            {gig.hiredFreelancer && (
              <div className="mb-6 bg-green-50 p-5 rounded-xl border-2 border-green-200 shadow-md">
                <h2 className="text-xl font-bold mb-2 text-green-800">✅ Hired Freelancer</h2>
                <p className="text-gray-700 font-semibold">{gig.hiredFreelancer.name}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-md">
                {error}
              </div>
            )}

            {!isOwner && gig.status === 'open' && (
              <>
                {!showBidForm ? (
                  <button
                    onClick={() => setShowBidForm(true)}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    Submit a Bid
                  </button>
                ) : (
                  <form onSubmit={handleBidSubmit} className="space-y-4 border-t pt-6">
                    <h3 className="text-xl font-bold">Your Bid</h3>
                    
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="message">
                        Message / Proposal *
                      </label>
                      <textarea
                        id="message"
                        value={bidData.message}
                        onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                        rows="4"
                        className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="price">
                        Your Price ($) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        value={bidData.price}
                        onChange={(e) => setBidData({ ...bidData, price: e.target.value })}
                        min="0"
                        step="0.01"
                        className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:bg-purple-700 transition-all duration-300 disabled:opacity-50"
                      >
                        {isLoading ? 'Submitting...' : 'Submit Bid'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBidForm(false)}
                        className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {isOwner && (
              <button
                onClick={() => navigate(`/gig/${id}/bids`)}
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-xl transform hover:scale-[1.02]"
              >
                View All Bids
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;
