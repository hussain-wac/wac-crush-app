import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import AnimatedBackground from '../components/AnimatedBackground';
import AnimatedText from '../components/AnimatedText';
import GlassCard from '../components/GlassCard';
import GradientButton from '../components/GradientButton';

const features = [
  { icon: '👀', title: 'Swipe', desc: 'Browse colleagues anonymously' },
  { icon: '💘', title: 'Match', desc: 'Mutual likes reveal the crush' },
  { icon: '🤫', title: 'Secret', desc: "No one knows unless it's mutual" },
];

function PulsingHeart() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
      className="relative my-4 md:my-6"
    >
      <motion.span
        animate={{
          scale: [1, 1.2, 1],
          filter: [
            'drop-shadow(0 0 10px rgba(255,75,110,0.4))',
            'drop-shadow(0 0 30px rgba(255,75,110,0.8))',
            'drop-shadow(0 0 10px rgba(255,75,110,0.4))',
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="text-6xl sm:text-7xl md:text-8xl block"
      >
        💘
      </motion.span>
    </motion.div>
  );
}

function FeatureCard({ icon, title, desc, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 + index * 0.15, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-colors hover:bg-white/10 min-w-0"
    >
      <span className="text-2xl sm:text-3xl">{icon}</span>
      <span className="text-white font-semibold text-sm sm:text-base">{title}</span>
      <span className="text-white/60 text-xs sm:text-sm text-center leading-tight">{desc}</span>
    </motion.div>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate('/swipe', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleEnter = () => {
    navigate(isAuthenticated ? '/swipe' : '/register');
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <GlassCard
          className="w-full max-w-md sm:max-w-lg px-6 py-10 sm:px-10 sm:py-14 text-center"
          delay={0.1}
        >
          {/* Title */}
          <AnimatedText
            text="Find my crush"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight"
            delay={0.2}
          />

          {/* Heart */}
          <PulsingHeart />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-white/80 text-base sm:text-lg md:text-xl leading-relaxed max-w-sm mx-auto mb-8"
          >
            Find your office crush! Swipe right on colleagues you fancy.
            If they swipe right too... it's a match!
          </motion.p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>

          {/* CTA Button */}
          <GradientButton
            onClick={handleEnter}
            variant="glow"
            size="lg"
            delay={1.3}
            className="w-full sm:w-auto"
          >
            Get Started
          </GradientButton>

          {/* Login link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-4"
          >
            <button
              onClick={() => navigate('/login')}
              className="text-white/50 text-sm hover:text-white/80 transition-colors cursor-pointer underline underline-offset-2"
            >
              Already have an account? Log in
            </button>
          </motion.p>
        </GlassCard>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-white/40 text-xs sm:text-sm mt-6 flex items-center gap-1.5"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live for 24 hours — have fun!
        </motion.p>
      </div>
    </AnimatedBackground>
  );
}

export default LandingPage;
