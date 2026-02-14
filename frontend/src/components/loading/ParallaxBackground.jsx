import { motion } from 'framer-motion'

const ParallaxBackground = () => {
  return (
    <motion.div
      className={`absolute inset-0 z-0 opacity-[.05]`}
      initial={{ scale: 1.1, x: 0, y: 0 }}
      animate={{
        x: [0, -10, 0, 10, 0],
        y: [0, 10, 0, -10, 0]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      style={{
        backgroundImage: 'url("/leaf-pattern.avif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
  )
}

export default ParallaxBackground
