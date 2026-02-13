import { motion } from 'framer-motion';
import { useMemo } from 'react';

const HEART_EMOJIS = ['💕', '💖', '💗', '💘', '💝', '✨', '💫'];

function FloatingHeart({ emoji, style, delay, duration }) {
  return (
    <motion.div
      initial={{ y: '100vh', opacity: 0, rotate: 0 }}
      animate={{
        y: '-10vh',
        opacity: [0, 1, 1, 0],
        rotate: [0, 15, -15, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute text-2xl md:text-3xl pointer-events-none select-none"
      style={style}
    >
      {emoji}
    </motion.div>
  );
}

const VARIANTS = {
  light: 'bg-gradient-to-br from-pink-400 via-primary to-purple-600',
  dark: 'bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950',
};

const ORB_VARIANTS = {
  light: {
    orb1: 'from-pink-300/30 to-transparent',
    orb2: 'from-purple-400/30 to-transparent',
    orb3: 'from-accent/20 to-transparent',
  },
  dark: {
    orb1: 'from-primary/15 to-transparent',
    orb2: 'from-purple-600/15 to-transparent',
    orb3: 'from-pink-500/10 to-transparent',
  },
};

function AnimatedBackground({ children, variant = 'light', className = '' }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        emoji: HEART_EMOJIS[i % HEART_EMOJIS.length],
        style: { left: `${5 + ((i * 8) % 90)}%` },
        delay: i * 1.5,
        duration: 8 + (i % 4) * 2,
      })),
    []
  );

  const orbs = ORB_VARIANTS[variant] || ORB_VARIANTS.light;

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${VARIANTS[variant] || VARIANTS.light} ${className}`}
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial ${orbs.orb1} rounded-full animate-float-slow`} />
        <div className={`absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial ${orbs.orb2} rounded-full animate-float-slow-reverse`} />
        <div className={`absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial ${orbs.orb3} rounded-full animate-pulse-soft`} />
      </div>

      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hearts.map((heart) => (
          <FloatingHeart key={heart.id} {...heart} />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default AnimatedBackground;
