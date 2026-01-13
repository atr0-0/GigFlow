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
      className="fixed top-20 left-4 right-4 sm:top-24 sm:left-auto sm:right-6 z-50 bg-gradient-to-r from-green-400 to-emerald-500 text-white p-4 sm:p-6 rounded-2xl shadow-2xl max-w-[calc(100vw-2rem)] sm:max-w-md animate-slide-in border-2 border-green-300 cursor-pointer hover:shadow-3xl hover:scale-105 transition-all duration-300"
    >
      <div className="flex items-start gap-2 sm:gap-4">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-xl font-bold mb-1">🎉 Congratulations!</h3>
          <p className="mt-1 sm:mt-2 text-sm sm:text-lg font-medium break-words">{notification.message}</p>
          <div className="mt-2 sm:mt-3 bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-3">
            <p className="text-xs sm:text-sm font-semibold">Budget: ${notification.gig.budget}</p>
            <p className="text-xs sm:text-sm font-semibold">Your Bid: ${notification.bid.price}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(clearNotification());
          }}
          className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
        >
          <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationListener;
