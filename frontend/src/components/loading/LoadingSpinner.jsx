import ParallaxBackground from './ParallaxBackground'
import FloatingLeaves from './FloatingLeaves'
import SpinnerCore from './SpinnerCore'
import LoadingText from './LoadingText'

const LoadingSpinner = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden bg-secondary/30">
      <ParallaxBackground />
      <FloatingLeaves count={6} />

      <div className="relative z-20 flex flex-col items-center">
        <SpinnerCore />
        <LoadingText />
      </div>
    </div>
  )
}

export default LoadingSpinner
