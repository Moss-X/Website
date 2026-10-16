import { Link } from 'react-router-dom'

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <Link to="/" className="font-display text-[26px] font-semibold tracking-[-0.02em]" aria-label="Moss X home">
          Moss<span className="text-moss">X</span>
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 py-12">
          <div className="flex flex-col gap-2">
            <h1 className="heading-display text-[40px] leading-tight">{title}</h1>
            <p className="text-muted">{subtitle}</p>
          </div>
          <p className="rounded-2xl bg-sage px-4 py-3 text-sm leading-relaxed">
            Demo store — please don&apos;t use real personal details or a password you use elsewhere.
          </p>
          {children}
          <p className="text-[15px] text-muted">{footer}</p>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <img src="/leaf-pattern.avif" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-14 text-ground">
          <p className="heading-display max-w-md text-[44px] leading-[1.05]">Plants that suit the way you live.</p>
          <p className="max-w-sm text-[#C9D3C4]">
            Save your cart, track orders and unlock gift coupons on bigger orders.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
