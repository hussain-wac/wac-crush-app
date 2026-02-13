import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  const handleEnter = () => {
    if (isAuthenticated) {
      navigate('/swipe');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-primary to-purple-500 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
          Company Crush
        </h1>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-6xl md:text-8xl"
        >
          💘
        </motion.span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-white/90 text-lg md:text-xl mt-8 mb-12 text-center max-w-md"
      >
        Find your office crush! Swipe right on colleagues you fancy. If they swipe right too... it's a match!
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleEnter}
        className="px-12 py-4 bg-white text-primary font-bold text-xl rounded-full shadow-xl hover:shadow-2xl transition-shadow"
      >
        Enter
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-white/70 text-sm mt-8"
      >
        This app expires in 24 hours. Have fun!
      </motion.p>
    </div>
  );
}

export default LandingPage;
