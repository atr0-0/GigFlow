import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../store/slices/gigsSlice';
import { Link } from 'react-router-dom';

const Gigs = () => {
  const dispatch = useDispatch();
  const { gigs, isLoading, error } = useSelector((state) => state.gigs);
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchGigs(''));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchGigs(search));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pastel-blue to-pastel-lavender">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pastel-purple mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading gigs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-white to-pastel-mint">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6 text-center">
            Browse Open Jobs
          </h1>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search jobs by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent transition-all shadow-md"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-purple-700"
            >
              Search
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 max-w-2xl mx-auto">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {gigs.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-2xl font-semibold text-gray-600 mb-2">No open jobs found</p>
            <p className="text-gray-500">Try adjusting your search or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gigs.map((gig) => (
              <div key={gig._id} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100 cursor-pointer">
                <h3 className="text-2xl font-display font-bold mb-3 text-gray-800">{gig.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{gig.description}</p>
                
                <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Budget</p>
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                      ${gig.budget}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Posted by</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-pastel-purple to-pastel-pink rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {gig.owner?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-700">{gig.owner?.name}</span>
                    </div>
                  </div>
                </div>

                {user && user._id !== gig.owner?._id && (
                  <Link
                    to={`/gig/${gig._id}`}
                    className="block text-center bg-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    View & Bid
                  </Link>
                )}

                {user && user._id === gig.owner?._id && (
                  <Link
                    to={`/my-gigs`}
                    className="block text-center bg-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Your Job
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gigs;
