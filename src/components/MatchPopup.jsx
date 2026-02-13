import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

function MatchPopup({ show, currentUser, matchedUser, onClose }) {
  useEffect(() => {
    if (show) {
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#ff4b6e', '#ff9a9e', '#a855f7', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-primary to-purple-500 rounded-3xl p-8 text-center max-w-sm w-full"
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-6"
            >
              It's a Match! 💕
            </motion.h2>

            {/* Profile Photos */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <img
                  src={currentUser?.image}
                  alt={currentUser?.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white"
                />
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="text-4xl"
              >
                💘
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <img
                  src={matchedUser?.image}
                  alt={matchedUser?.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white"
                />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-lg mb-6"
            >
              You and <span className="font-bold">{matchedUser?.name}</span> liked each other!
            </motion.p>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-8 py-3 bg-white text-primary font-bold rounded-full shadow-lg"
            >
              Keep Swiping
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MatchPopup;
