import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useCallback } from 'react';

function SwipeCard({ user, onSwipeLeft, onSwipeRight }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const cardOpacity = useTransform(x, [-200, -100, 0, 100, 200], [0.7, 1, 1, 1, 0.7]);

  // Overlay indicators
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragEnd = useCallback(
    (_, info) => {
      const threshold = 80;
      const velocity = info.velocity.x;

      if (info.offset.x > threshold || velocity > 500) {
        onSwipeRight();
      } else if (info.offset.x < -threshold || velocity < -500) {
        onSwipeLeft();
      }
    },
    [onSwipeLeft, onSwipeRight]
  );

  return (
    <motion.div
      style={{ x, rotate, opacity: cardOpacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="absolute w-[calc(100%-2rem)] max-w-[360px] cursor-grab active:cursor-grabbing"
    >
      <div className="bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        {/* Image */}
        <div className="relative aspect-[3/4]">
          <img
            src={user.image}
            alt={user.name}
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Like Overlay */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute inset-0 bg-green-500/20 flex items-center justify-center"
          >
            <div className="text-5xl sm:text-6xl border-4 border-green-400 text-green-400 font-extrabold px-5 py-1.5 rounded-xl rotate-[-15deg] shadow-[0_0_30px_rgba(74,222,128,0.4)]">
              LIKE
            </div>
          </motion.div>

          {/* Nope Overlay */}
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute inset-0 bg-red-500/20 flex items-center justify-center"
          >
            <div className="text-5xl sm:text-6xl border-4 border-red-400 text-red-400 font-extrabold px-5 py-1.5 rounded-xl rotate-[15deg] shadow-[0_0_30px_rgba(248,113,113,0.4)]">
              NOPE
            </div>
          </motion.div>

          {/* Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <h2 className="text-white text-xl sm:text-2xl font-bold drop-shadow-lg">
                {user.name}
              </h2>
              {user.gender && (
                <span
                  className={`text-sm px-2 py-0.5 rounded-full font-medium ${
                    user.gender === 'boy'
                      ? 'bg-blue-500/80 text-white'
                      : 'bg-pink-500/80 text-white'
                  }`}
                >
                  {user.gender === 'boy' ? '👦' : '👧'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SwipeCard;
