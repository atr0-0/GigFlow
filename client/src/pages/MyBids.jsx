import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBids } from '../store/slices/bidsSlice';
import { Link } from 'react-router-dom';

const MyBids = () => {
  const dispatch = useDispatch();
  const { myBids, isLoading, error } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchMyBids());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pastel-lavender to-pastel-blue">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pastel-purple mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading your bids...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-lavender via-white to-pastel-mint py-12">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-10 text-center">My Bids</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 max-w-4xl mx-auto">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {myBids.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl max-w-2xl mx-auto">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-2xl font-semibold text-gray-600 mb-4">You haven't submitted any bids yet</p>
            <Link
              to="/gigs"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-xl transform hover:scale-105"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            {myBids.map((bid) => (
              <div
                key={bid._id}
                className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border-2 ${
                  bid.status === 'hired' ? 'border-green-400 bg-green-50/50' : 'border-gray-100'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Link
                        to={`/gig/${bid.gig?._id}`}
                        className="text-2xl font-display font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                      >
                        {bid.gig?.title}
                      </Link>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
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
                      {bid.gig?.status === 'assigned' && (
                        <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 shadow-sm">
                          Job Assigned
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">{bid.gig?.description}</p>
                  </div>
                </div>

                <div className="border-t-2 border-gray-100 pt-6">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1 font-medium">Job Budget</p>
                      <p className="text-2xl font-bold text-gray-800">${bid.gig?.budget}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1 font-medium">Your Bid</p>
                      <p className="text-2xl font-bold text-green-600">${bid.price}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Your Message</p>
                    <p className="text-gray-700 whitespace-pre-wrap bg-pastel-lavender/30 p-4 rounded-xl leading-relaxed">
                      {bid.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>📅 Submitted on {new Date(bid.createdAt).toLocaleDateString()}</span>
                    {bid.status === 'hired' && (
                      <span className="text-green-600 font-semibold">🎉 Congratulations!</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBids;
