import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';
import { getMe } from './store/slices/authSlice';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import NotificationListener from './components/NotificationListener';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Gigs from './pages/Gigs';
import GigDetail from './pages/GigDetail';
import CreateGig from './pages/CreateGig';
import MyGigs from './pages/MyGigs';
import GigBids from './pages/GigBids';
import MyBids from './pages/MyBids';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        {isAuthenticated && <NotificationListener />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route
            path="/gig/:id"
            element={
              <PrivateRoute>
                <GigDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-gig"
            element={
              <PrivateRoute>
                <CreateGig />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-gigs"
            element={
              <PrivateRoute>
                <MyGigs />
              </PrivateRoute>
            }
          />
          <Route
            path="/gig/:id/bids"
            element={
              <PrivateRoute>
                <GigBids />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-bids"
            element={
              <PrivateRoute>
                <MyBids />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
