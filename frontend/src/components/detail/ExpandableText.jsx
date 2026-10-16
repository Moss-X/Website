import { useState } from 'react'

function ExpandableText({ text = '', limit = 320 }) {
  const [open, setOpen] = useState(false)
  const long = text.length > limit
  return (
    <div className="flex flex-col items-start gap-2">
      <p className="max-w-[36em] text-[17px] leading-[1.7] text-[#3A4637]">
        {long && !open ? `${text.slice(0, limit).trimEnd()}…` : text}
      </p>
      {long && (
        <button
          type="button"
          className="text-sm font-bold text-moss hover:text-forest"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

export default ExpandableText
