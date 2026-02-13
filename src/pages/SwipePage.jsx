import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { usersAPI, crushAPI } from '../services/api';
import SwipeCard from '../components/SwipeCard';
import MatchPopup from '../components/MatchPopup';
import AnimatedBackground from '../components/AnimatedBackground';
import GradientButton from '../components/GradientButton';

function SwipePage() {
  const navigate = useNavigate();
  const {
    user,
    swipeableUsers,
    setSwipeableUsers,
    currentIndex,
    nextUser,
    addMatch,
    hasMoreUsers,
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
      <AnimatedBackground variant="dark">
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="text-6xl"
          >
            💕
          </motion.div>
        </div>
      </AnimatedBackground>
    );
  }

  if (error) {
    return (
      <AnimatedBackground variant="dark">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center max-w-sm w-full">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-white/80 mb-6">{error}</p>
            <GradientButton onClick={loadUsers} size="md">
              Try Again
            </GradientButton>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground variant="dark">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-bold text-lg sm:text-xl"
          >
            Find my crush 💘
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/matches')}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl hover:bg-white/20 transition-colors cursor-pointer"
          >
            💕
          </motion.button>
        </header>

        {/* Swipe hint */}
        {hasMore && currentSwipeUser && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white/30 text-xs sm:text-sm"
          >
            Swipe or tap the buttons below
          </motion.p>
        )}

        {/* Card Area */}
        <div className="flex-1 flex items-center justify-center px-4 py-2 sm:py-4 relative">
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
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-10 text-center max-w-sm w-full"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  That's everyone!
                </h2>
                <p className="text-white/60 mb-6">
                  You've seen all available profiles. Check your matches!
                </p>
                <GradientButton onClick={() => navigate('/matches')} size="md">
                  View Matches
                </GradientButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        {hasMore && currentSwipeUser && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="pb-8 pt-2 sm:pb-10 flex justify-center items-center gap-6"
          >
            {/* Nope button */}
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/10 backdrop-blur-sm border-2 border-red-400/50 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(248,113,113,0.15)] hover:shadow-[0_0_30px_rgba(248,113,113,0.3)] hover:border-red-400 transition-all cursor-pointer"
            >
              ✕
            </motion.button>

            {/* Like button */}
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => handleSwipe('right')}
              className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-br from-primary to-pink-500 border-2 border-pink-400/50 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,75,110,0.3)] hover:shadow-[0_0_50px_rgba(255,75,110,0.5)] transition-all cursor-pointer"
            >
              ❤️
            </motion.button>
          </motion.div>
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
    </AnimatedBackground>
  );
}

export default SwipePage;
