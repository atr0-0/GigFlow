import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-pastel-purple/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-3xl font-display font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent hover:scale-105 transition-transform">
            GigFlow
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/gigs" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Browse Gigs
                </Link>
                <Link to="/my-gigs" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  My Jobs
                </Link>
                <Link to="/my-bids" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  My Bids
                </Link>
                <Link 
                  to="/create-gig" 
                  className="bg-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-purple-700"
                >
                  Post Job
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">Hi, {user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-purple-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
