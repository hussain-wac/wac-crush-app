import { motion, useMotionValue, useTransform } from 'framer-motion';

function SwipeCard({ user, onSwipeLeft, onSwipeRight }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Overlay indicators
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (event, info) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      onSwipeRight();
    } else if (info.offset.x < -threshold) {
      onSwipeLeft();
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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
            <div className="text-6xl border-4 border-green-500 text-green-500 font-bold px-6 py-2 rounded-lg rotate-[-20deg]">
              LIKE
            </div>
          </motion.div>

          {/* Nope Overlay */}
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute inset-0 bg-red-500/20 flex items-center justify-center"
          >
            <div className="text-6xl border-4 border-red-500 text-red-500 font-bold px-6 py-2 rounded-lg rotate-[20deg]">
              NOPE
            </div>
          </motion.div>

          {/* Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h2 className="text-white text-2xl font-bold">{user.name}</h2>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SwipeCard;
