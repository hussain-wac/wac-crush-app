import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: 'spring', damping: 12, stiffness: 200 },
  },
};

function AnimatedText({ text, className = '', delay = 0 }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ delayChildren: delay }}
      className={`flex flex-wrap justify-center ${className}`}
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={letterVariants}
          className={char === ' ' ? 'w-[0.3em]' : ''}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default AnimatedText;
