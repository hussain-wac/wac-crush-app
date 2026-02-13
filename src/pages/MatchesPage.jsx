import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { matchesAPI } from '../services/api';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

function MatchCard({ match, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 120, damping: 14 }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="group"
    >
      <div className="relative backdrop-blur-xl bg-white/[0.07] border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-center transition-colors hover:bg-white/[0.12] overflow-hidden">
        {/* Glow effect behind image */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-radial from-primary/30 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Profile image */}
        <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-3">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary via-pink-400 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity" />
          <img
            src={match.image}
            alt={match.name}
            className="relative w-full h-full rounded-full object-cover border-2 border-gray-900"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
            className="absolute -bottom-1 -right-1 text-lg sm:text-xl"
          >
            💕
          </motion.div>
        </div>

        {/* Name */}
        <h3 className="font-bold text-white text-sm sm:text-base truncate">
          {match.name}
        </h3>
        <p className="text-white/40 text-xs mt-0.5">Matched</p>
      </div>
    </motion.div>
  );
}

function MatchesPage() {
  const navigate = useNavigate();
  const { matches, setMatches } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      const data = await matchesAPI.getMatches();
      setMatches(data);
    } catch (err) {
      setError('Failed to load matches');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <AnimatedBackground variant="dark">
      <div className="min-h-screen flex flex-col pb-24">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/swipe')}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer shrink-0"
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

          <div className="flex-1 min-w-0">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white font-bold text-xl sm:text-2xl truncate"
            >
              Your Matches
            </motion.h1>
            {!error && matches.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/40 text-xs sm:text-sm"
              >
                {matches.length} {matches.length === 1 ? 'person' : 'people'} liked you back
              </motion.p>
            )}
          </div>

          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="text-2xl sm:text-3xl"
          >
            💘
          </motion.span>
        </header>

        {/* Content */}
        <div className="flex-1 px-4 sm:px-6 max-w-2xl mx-auto w-full">
          {/* Error state */}
          {error && (
            <GlassCard className="p-6 sm:p-8 text-center" delay={0.1}>
              <div className="text-5xl mb-4">😕</div>
              <p className="text-white/70 mb-6">{error}</p>
              <GradientButton onClick={loadMatches} size="md">
                Try Again
              </GradientButton>
            </GlassCard>
          )}

          {/* Empty state */}
          {!error && matches.length === 0 && (
            <GlassCard className="p-8 sm:p-10 text-center mt-8 sm:mt-16" delay={0.1}>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="text-6xl sm:text-7xl mb-5"
              >
                💔
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                No matches yet
              </h2>
              <p className="text-white/50 text-sm sm:text-base mb-8 max-w-xs mx-auto leading-relaxed">
                Keep swiping! Your crush might be waiting to match with you.
              </p>
              <GradientButton onClick={() => navigate('/swipe')} variant="glow" size="md">
                Keep Swiping
              </GradientButton>
            </GlassCard>
          )}

          {/* Matches grid */}
          {matches.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-2">
              {matches.map((match, index) => (
                <MatchCard key={match._id} match={match} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Sticky bottom CTA */}
        {matches.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 pt-10 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent pointer-events-none">
            <div className="pointer-events-auto">
              <GradientButton
                onClick={() => navigate('/swipe')}
                variant="glow"
                size="md"
                delay={0.4}
              >
                Back to Swiping
              </GradientButton>
            </div>
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
}

export default MatchesPage;
