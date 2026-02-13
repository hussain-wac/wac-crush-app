import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { matchesAPI } from '../services/api';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-primary to-purple-500 p-4">
      {/* Header */}
      <header className="flex items-center mb-6">
        <button
          onClick={() => navigate('/swipe')}
          className="text-white/80 hover:text-white text-2xl mr-4"
        >
          ←
        </button>
        <h1 className="text-white font-bold text-2xl">Your Matches 💕</h1>
      </header>

      {/* Matches Grid */}
      <div className="max-w-2xl mx-auto">
        {error && (
          <div className="bg-white rounded-xl p-4 text-center mb-4">
            <p className="text-red-500">{error}</p>
            <button
              onClick={loadMatches}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {!error && matches.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No matches yet
            </h2>
            <p className="text-gray-600 mb-6">
              Keep swiping! Your crush might be waiting to match with you.
            </p>
            <button
              onClick={() => navigate('/swipe')}
              className="px-6 py-3 bg-gradient-to-r from-primary to-purple-500 text-white font-bold rounded-xl"
            >
              Keep Swiping
            </button>
          </motion.div>
        )}

        {matches.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {matches.map((match, index) => (
              <motion.div
                key={match._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-4 text-center"
              >
                <div className="relative mx-auto w-24 h-24 mb-3">
                  <img
                    src={match.image}
                    alt={match.name}
                    className="w-full h-full rounded-full object-cover border-4 border-primary"
                  />
                  <div className="absolute -bottom-1 -right-1 text-2xl">
                    💕
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 truncate">
                  {match.name}
                </h3>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Back to Swiping Button */}
      {matches.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/swipe')}
            className="px-8 py-3 bg-white text-primary font-bold rounded-full shadow-xl"
          >
            Back to Swiping
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default MatchesPage;
