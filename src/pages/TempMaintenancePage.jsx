import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';

function TempMaintenancePage() {
  return (
    <AnimatedBackground variant="dark">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 sm:py-16">

        {/* Animated heart icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="mb-6"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 3, -3, 0],
            }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-7xl sm:text-8xl md:text-9xl select-none"
          >
            💘
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-primary to-purple-400 bg-clip-text text-transparent mb-3"
        >
          WAC Crush
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-white/40 text-sm sm:text-base mb-8 sm:mb-10 tracking-wide"
        >
          Something exciting is coming...
        </motion.p>

        {/* Main card */}
        <GlassCard className="max-w-md w-full p-6 sm:p-8 md:p-10 text-center" delay={0.4}>
          {/* Wrench / maintenance icon */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="text-4xl sm:text-5xl mb-5"
          >
            🔧
          </motion.div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            We're Revamping!
          </h2>

          <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6 max-w-xs mx-auto">
            We're upgrading WAC Crush to make it even better for you. The app will be back with a fresh new look soon.
          </p>

          {/* Divider */}
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-6" />

          {/* Mail notification info */}
          <div className="flex items-start gap-3 bg-white/[0.05] border border-white/10 rounded-2xl p-4 sm:p-5 text-left">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="text-2xl sm:text-3xl shrink-0 mt-0.5"
            >
              📩
            </motion.div>
            <div>
              <p className="text-white font-semibold text-sm sm:text-base mb-1">
                Check your email!
              </p>
              <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
                We'll send you a mail about the matches you've got so far. Stay tuned for updates!
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 sm:mt-10 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 rounded-full bg-green-400"
            />
            <p className="text-white/30 text-xs sm:text-sm">
              Update in progress
            </p>
          </div>

          <p className="text-white/20 text-[10px] sm:text-xs tracking-wider uppercase">
            Made with love by WAC
          </p>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}

export default TempMaintenancePage;
