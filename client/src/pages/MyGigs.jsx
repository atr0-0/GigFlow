import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyGigs, deleteGig } from '../store/slices/gigsSlice';
import { Link } from 'react-router-dom';

const MyGigs = () => {
  const dispatch = useDispatch();
  const { myGigs, isLoading, error } = useSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(fetchMyGigs());
  }, [dispatch]);

  const handleDelete = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await dispatch(deleteGig(gigId));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-lavender via-white to-pastel-mint py-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">My Posted Jobs</h1>
          <Link
            to="/create-gig"
            className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-xl transform hover:scale-105"
          >
            + Post New Job
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {myGigs.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-2xl font-semibold text-gray-600 mb-4">You haven't posted any jobs yet</p>
            <Link
              to="/create-gig"
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-all duration-300 font-semibold shadow-md hover:shadow-xl"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {myGigs.map((gig) => (
              <div key={gig._id} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{gig.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                          gig.status === 'open'
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                            : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                        }`}
                      >
                        {gig.status === 'open' ? '🟢 Open' : '✅ Assigned'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">{gig.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-lg font-bold text-green-600">
                        Budget: ${gig.budget}
                      </span>
                      {gig.hiredFreelancer && (
                        <span className="text-sm text-gray-600">
                          Hired: {gig.hiredFreelancer.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 min-w-[150px]">
                    <Link
                      to={`/gig/${gig._id}/bids`}
                      className="bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition-all duration-300 text-center font-semibold shadow-md hover:shadow-lg"
                    >
                      View Bids
                    </Link>
                    {gig.status === 'open' && (
                      <button
                        onClick={() => handleDelete(gig._id)}
                        className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                      >
                        🗑️ Delete
                      </button>
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

export default MyGigs;
