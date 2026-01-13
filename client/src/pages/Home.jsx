import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-pastel-lavender to-pastel-pink">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-display font-bold text-gray-800 mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              GigFlow
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 font-light leading-relaxed">
            Your gateway to endless freelance opportunities. Connect, collaborate, and create amazing projects together.
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Whether you're looking to hire talented freelancers or showcase your skills, GigFlow makes it seamless and enjoyable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/gigs"
                  className="px-8 py-4 bg-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl hover:bg-purple-700 transform hover:scale-105 transition-all duration-300"
                >
                  Browse Gigs
                </Link>
                <Link
                  to="/create-gig"
                  className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                >
                  Post a Job
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-purple-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl hover:bg-purple-700 transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer border border-pastel-blue/20">
            <div className="w-16 h-16 bg-gradient-to-br from-pastel-blue to-pastel-lightblue rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-4 text-center">Find Projects</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Browse through hundreds of exciting projects posted by clients worldwide. Find the perfect match for your skills.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer border border-pastel-pink/20">
            <div className="w-16 h-16 bg-gradient-to-br from-pastel-pink to-pastel-rose rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-4 text-center">Hire Talent</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Post your projects and receive bids from talented freelancers. Choose the perfect candidate for your job.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-pointer border border-pastel-mint/20">
            <div className="w-16 h-16 bg-gradient-to-br from-pastel-mint to-pastel-green rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-4 text-center">Work Seamlessly</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Real-time notifications keep you updated. Experience smooth collaboration from start to finish.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-bounce-soft">
              <p className="text-5xl font-display font-bold bg-gradient-to-r from-pastel-purple to-pastel-pink bg-clip-text text-transparent mb-2">
                1000+
              </p>
              <p className="text-gray-600 font-medium">Active Projects</p>
            </div>
            <div className="animate-bounce-soft" style={{animationDelay: '0.1s'}}>
              <p className="text-5xl font-display font-bold bg-gradient-to-r from-pastel-blue to-pastel-mint bg-clip-text text-transparent mb-2">
                500+
              </p>
              <p className="text-gray-600 font-medium">Talented Freelancers</p>
            </div>
            <div className="animate-bounce-soft" style={{animationDelay: '0.2s'}}>
              <p className="text-5xl font-display font-bold bg-gradient-to-r from-pastel-peach to-pastel-yellow bg-clip-text text-transparent mb-2">
                99%
              </p>
              <p className="text-gray-600 font-medium">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
