import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGig } from '../store/slices/gigsSlice';
import { useNavigate } from 'react-router-dom';

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.gigs);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createGig({
      ...formData,
      budget: parseFloat(formData.budget)
    }));
    
    if (result.type === 'gigs/createGig/fulfilled') {
      navigate('/my-gigs');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-lavender via-white to-pastel-blue py-12">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-100">
          <h1 className="text-4xl font-display font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent text-center">Post a New Job</h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="title">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent transition-all shadow-sm"
                placeholder="e.g., Build a mobile app"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent transition-all shadow-sm"
                placeholder="Describe your project requirements..."
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="budget">
                Budget ($) *
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent transition-all shadow-sm"
                placeholder="Enter budget amount"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Posting...' : 'Post Job'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-gigs')}
                className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;
