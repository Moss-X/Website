import { motion } from 'framer-motion'

const LoadingText = ({ text = 'Growing something beautiful...' }) => {
  return (
    <motion.p
      className="mt-6 text-primary font-medium tracking-widest uppercase text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {text}
    </motion.p>
  )
}

export default LoadingText
