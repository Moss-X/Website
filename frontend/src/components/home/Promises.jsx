import { Lock, ShoppingBag, Sun } from 'lucide-react'

const ITEMS = [
  { icon: Sun, title: 'Care notes on every plant', body: 'Light, water and difficulty, listed up front.' },
  { icon: ShoppingBag, title: 'Your cart follows you', body: 'Shop as a guest — it is saved when you sign in.' },
  { icon: Lock, title: 'Secure payments', body: 'UPI, cards and netbanking via Razorpay.' }
]

function Promises() {
  return (
    <section className="border-y border-line">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-4">
            <Icon className="mt-0.5 h-7 w-7 shrink-0 text-moss" strokeWidth={1.8} aria-hidden="true" />
            <div>
              <h3 className="mb-1 font-bold">{title}</h3>
              <p className="text-[15px] leading-normal text-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Promises
