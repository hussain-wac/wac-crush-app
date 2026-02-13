import { motion } from 'framer-motion';

function GradientButton({
  children,
  onClick,
  variant = 'solid',
  size = 'lg',
  className = '',
  delay = 0,
}) {
  const sizeClasses = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-12 py-4 text-lg',
  };

  const variantClasses = {
    solid:
      'bg-white text-primary hover:bg-white/90 shadow-[0_8px_32px_rgba(255,75,110,0.3)]',
    outline:
      'bg-transparent border-2 border-white/60 text-white hover:bg-white/10 backdrop-blur-sm',
    glow: 'bg-white text-primary shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]',
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        font-bold rounded-full
        transition-all duration-300 ease-out
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

export default GradientButton;
