import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(true)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-md w-full relative">
        <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold text-red-600 mb-4">Disclaimer</h2>
        <p className="text-gray-700 mb-4 font-medium">
          Warning: Do not add personal details as they might be stored in our database.
        </p>
        <p className="text-gray-600 text-sm">Contact us to remove yourself.</p>

        <button
          onClick={() => setIsOpen(false)}
          className="mt-6 w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          I Understand
        </button>
      </div>
    </div>
  )
}

export default DisclaimerModal
