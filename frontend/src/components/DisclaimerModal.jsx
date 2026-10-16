import { useEffect, useState } from 'react'
import { Info } from 'lucide-react'

const STORAGE_KEY = 'mossx-demo-notice-dismissed'

// Shown once per browser: this is a demo store backed by a shared database.
const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY)
    } catch {
      return true
    }
  })

  const close = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* storage blocked: just close */
    }
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-4 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md">
      <div
        role="dialog"
        aria-labelledby="notice-title"
        className="flex gap-4 rounded-3xl bg-ink p-5 text-ground shadow-[0_18px_40px_rgba(31,42,30,0.3)]"
      >
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-sage-strong" aria-hidden="true" />
        <div className="flex flex-col gap-3">
          <h2 id="notice-title" className="font-bold">
            This is a demo store
          </h2>
          <p className="text-sm leading-relaxed text-[#C9D3C4]">
            Please don&apos;t enter real personal details — anything you submit may be stored in our database. Contact
            us to have your data removed.
          </p>
          <button type="button" onClick={close} className="btn-light h-10 self-start px-5 text-sm">
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default DisclaimerModal
