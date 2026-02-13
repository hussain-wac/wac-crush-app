import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import useStore from '../store/useStore';
import { crushAPI, swrFetcher } from '../services/api';
import { connectSocket, disconnectSocket, onMatch, offMatch } from '../services/socket';
import SwipeCard from '../components/SwipeCard';
import MatchPopup from '../components/MatchPopup';
import AnimatedBackground from '../components/AnimatedBackground';
import GradientButton from '../components/GradientButton';

const UNDO_DURATION = 4; // seconds

function UndoToast({ user, direction, secondsLeft, onUndo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-gray-800/90 backdrop-blur-md border border-white/15 shadow-xl">
        <img
          src={user.image}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover border border-white/20"
        />
        <span className="text-white/70 text-sm">
          {direction === 'right' ? 'Liked' : 'Passed'}{' '}
          <span className="text-white font-medium">{user.name}</span>
        </span>

        {/* Countdown ring */}
        <div className="relative w-7 h-7 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <motion.circle
              cx="14"
              cy="14"
              r="12"
              fill="none"
              stroke="#ff4b6e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 12}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 12 }}
              transition={{ duration: UNDO_DURATION, ease: 'linear' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-white/60 text-[10px] font-medium">
            {secondsLeft}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={onUndo}
          className="px-3 py-1 rounded-full bg-primary text-white text-sm font-bold cursor-pointer hover:bg-primary/80 transition-colors"
        >
          Undo
        </motion.button>
      </div>
    </motion.div>
  );
}

// Real-time match notification toast
function MatchNotification({ matchedUser, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -50, x: '-50%' }}
      className="fixed top-4 left-1/2 z-50"
    >
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 shadow-xl">
        <img
          src={matchedUser.image}
          alt={matchedUser.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-white"
        />
        <div>
          <p className="text-white font-bold">New Match!</p>
          <p className="text-white/80 text-sm">{matchedUser.name} likes you too!</p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-white/70 hover:text-white cursor-pointer"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}

function SwipePage() {
  const navigate = useNavigate();
  const {
    user,
    swipeableUsers,
    setSwipeableUsers,
    currentIndex,
    nextUser,
    prevUser,
    addMatch,
    hasMoreUsers,
    logout,
  } = useStore();

  // SWR: fetch users with 8-second refresh
  const { data: usersData, error: swrError, isLoading, mutate } = useSWR(
    '/users',
    swrFetcher,
    { refreshInterval: 8000, revalidateOnFocus: false }
  );

  useEffect(() => {
    if (usersData) setSwipeableUsers(usersData);
  }, [usersData, setSwipeableUsers]);

  const [matchedUser, setMatchedUser] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [realtimeMatch, setRealtimeMatch] = useState(null);

  // Undo state
  const [pendingSwipe, setPendingSwipe] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(UNDO_DURATION);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  // Socket connection for real-time match notifications
  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);

      const handleMatch = (data) => {
        console.log('Real-time match received:', data);
        setRealtimeMatch(data.matchedUser);
        addMatch(data.matchedUser);
      };

      onMatch(handleMatch);

      return () => {
        offMatch(handleMatch);
        disconnectSocket();
      };
    }
  }, [user?._id, addMatch]);

  useEffect(() => {
    return () => clearPendingTimers();
  }, []);

  const clearPendingTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    timerRef.current = null;
    countdownRef.current = null;
  }, []);

  const commitSwipe = useCallback(async (targetUser, direction) => {
    clearPendingTimers();
    setPendingSwipe(null);

    try {
      const result = await crushAPI.swipe(targetUser._id, direction);

      if (result.matched) {
        setMatchedUser(result.matchedUser);
        addMatch(result.matchedUser);
        setShowMatch(true);
      }
    } catch (err) {
      console.error('Swipe error:', err);
    }
  }, [clearPendingTimers, addMatch]);

  const handleSwipe = (direction) => {
    const currentUser = swipeableUsers[currentIndex];
    if (!currentUser) return;

    // If there's already a pending swipe, commit it immediately before starting a new one
    if (pendingSwipe) {
      commitSwipe(pendingSwipe.user, pendingSwipe.direction);
    }

    // Move to next card immediately
    nextUser();

    // Start undo timer
    setSecondsLeft(UNDO_DURATION);
    setPendingSwipe({ user: currentUser, direction });

    clearPendingTimers();

    // Countdown display
    let remaining = UNDO_DURATION;
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      setSecondsLeft(remaining);
      if (remaining <= 0) clearInterval(countdownRef.current);
    }, 1000);

    // Auto-commit after UNDO_DURATION seconds
    timerRef.current = setTimeout(() => {
      commitSwipe(currentUser, direction);
    }, UNDO_DURATION * 1000);
  };

  const handleUndo = useCallback(() => {
    if (!pendingSwipe) return;

    clearPendingTimers();
    setPendingSwipe(null);
    prevUser();
  }, [pendingSwipe, clearPendingTimers, prevUser]);

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

  if (swrError) {
    return (
      <AnimatedBackground variant="dark">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 text-center max-w-sm w-full">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-white/80 mb-6">Failed to load users. Please try again.</p>
            <div className="flex flex-col items-center gap-3">
              <GradientButton onClick={() => mutate()} size="md">
                Try Again
              </GradientButton>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="text-white/40 text-sm hover:text-white/70 transition-colors cursor-pointer underline underline-offset-2 py-6"
              >
                Logout & go home
              </button>
            </div>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground variant="dark">
      <div className="min-h-screen flex flex-col">
        {/* Real-time match notification */}
        <AnimatePresence>
          {realtimeMatch && (
            <MatchNotification
              matchedUser={realtimeMatch}
              onClose={() => setRealtimeMatch(null)}
            />
          )}
        </AnimatePresence>

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

        {/* Undo Toast */}
        <AnimatePresence>
          {pendingSwipe && (
            <UndoToast
              user={pendingSwipe.user}
              direction={pendingSwipe.direction}
              secondsLeft={secondsLeft}
              onUndo={handleUndo}
            />
          )}
        </AnimatePresence>

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
