import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

const SpinnerCore = () => {
  return (
    <div className="relative">
      <motion.div
        className="w-24 h-24 border-4 border-primary/20 rounded-full"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-0 left-0 w-24 h-24 border-t-4 border-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute top-0 left-0 w-24 h-24 flex items-center justify-center"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Leaf className="text-primary" size={32} />
      </motion.div>
    </div>
  )
}

export default SpinnerCore
