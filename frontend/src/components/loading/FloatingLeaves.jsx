import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

const FloatingLeaves = ({ count = 6 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-10 text-primary/20"
          initial={{
            x: Math.random() * 100 - 50 + '%',
            y: '100%',
            rotate: 0,
            opacity: 0
          }}
          animate={{
            y: '-10%',
            rotate: 360,
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut'
          }}
        >
          <Leaf size={24 + Math.random() * 24} />
        </motion.div>
      ))}
    </>
  )
}

export default FloatingLeaves
