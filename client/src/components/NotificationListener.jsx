import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNotification, clearNotification } from '../store/slices/bidsSlice';
import { getSocket } from '../services/socket';
import { useNavigate } from 'react-router-dom';

const NotificationListener = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notification } = useSelector((state) => state.bids);

  const handleNotificationClick = () => {
    if (notification?.gig?._id) {
      navigate(`/gig/${notification.gig._id}`);
      dispatch(clearNotification());
    }
  };

  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      socket.on('hired', (data) => {
        dispatch(setNotification(data));
        
        setTimeout(() => {
          dispatch(clearNotification());
        }, 10000);
      });

      return () => {
        socket.off('hired');
      };
    }
  }, [dispatch]);

  if (!notification) return null;

  return (
    <div
      onClick={handleNotificationClick}
      className="fixed top-24 right-6 z-50 bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl shadow-2xl max-w-md animate-slide-in border-2 border-green-300 cursor-pointer hover:shadow-3xl hover:scale-105 transition-all duration-300"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-xl font-bold mb-1">🎉 Congratulations!</h3>
          <p className="mt-2 text-lg font-medium">{notification.message}</p>
          <div className="mt-3 bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm font-semibold">Budget: ${notification.gig.budget}</p>
            <p className="text-sm font-semibold">Your Bid: ${notification.bid.price}</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(clearNotification())}
          className="ml-2 text-white hover:text-gray-200 transition-colors"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationListener;
