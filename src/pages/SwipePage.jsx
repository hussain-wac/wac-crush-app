import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { usersAPI, crushAPI } from '../services/api';
import SwipeCard from '../components/SwipeCard';
import MatchPopup from '../components/MatchPopup';

function SwipePage() {
  const navigate = useNavigate();
  const {
    user,
    swipeableUsers,
    setSwipeableUsers,
    currentIndex,
    nextUser,
    addMatch,
    hasMoreUsers
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [matchedUser, setMatchedUser] = useState(null);
  const [showMatch, setShowMatch] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const users = await usersAPI.getSwipeableUsers();
      setSwipeableUsers(users);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    const currentUser = swipeableUsers[currentIndex];
    if (!currentUser) return;

    try {
      const result = await crushAPI.swipe(currentUser._id, direction);

      if (result.matched) {
        setMatchedUser(result.matchedUser);
        addMatch(result.matchedUser);
        setShowMatch(true);
      }

      nextUser();
    } catch (err) {
      console.error('Swipe error:', err);
    }
  };

  const currentSwipeUser = swipeableUsers[currentIndex];
  const hasMore = hasMoreUsers();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent via-primary to-purple-500 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="text-6xl"
        >
          💕
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent via-primary to-purple-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadUsers}
            className="px-6 py-2 bg-primary text-white rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-primary to-purple-500 flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="text-white/80 hover:text-white text-2xl"
        >
          ←
        </button>
        <h1 className="text-white font-bold text-xl">Find my crush 💘</h1>
        <button
          onClick={() => navigate('/matches')}
          className="text-white/80 hover:text-white text-2xl"
        >
          💕
        </button>
      </header>

      {/* Card Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {hasMore && currentSwipeUser ? (
            <SwipeCard
              key={currentSwipeUser._id}
              user={currentSwipeUser}
              onSwipeLeft={() => handleSwipe('left')}
              onSwipeRight={() => handleSwipe('right')}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                That's everyone!
              </h2>
              <p className="text-gray-600 mb-6">
                You've seen all available profiles. Check your matches!
              </p>
              <button
                onClick={() => navigate('/matches')}
                className="px-6 py-3 bg-gradient-to-r from-primary to-purple-500 text-white font-bold rounded-xl"
              >
                View Matches
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      {hasMore && currentSwipeUser && (
        <div className="p-6 flex justify-center gap-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-3xl"
          >
            ❌
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-3xl"
          >
            ❤️
          </motion.button>
        </div>
      )}

      {/* Match Popup */}
      <MatchPopup
        show={showMatch}
        currentUser={user}
        matchedUser={matchedUser}
        onClose={() => {
          setShowMatch(false);
          setMatchedUser(null);
        }}
      />
    </div>
  );
}

export default SwipePage;
