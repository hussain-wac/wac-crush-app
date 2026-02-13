import { motion } from 'framer-motion';

function GlassCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100, damping: 15 }}
      className={`
        backdrop-blur-xl bg-white/10
        border border-white/20
        rounded-3xl
        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;
