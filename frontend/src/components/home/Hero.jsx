import { Link } from 'react-router-dom'
import { cld } from '../../lib/image'
import { formatCurrency } from '../../utils/formatCurrency'

function Hero({ highlights = [] }) {
  const [main, second, third] = highlights

  return (
    <section className="container-page grid items-center gap-12 pt-10 pb-16 md:pt-14 lg:grid-cols-2 lg:pb-20">
      <div className="flex animate-fade-up flex-col gap-6">
        <p className="eyebrow text-moss">Nursery-grown plants, delivered</p>
        <h1 className="heading-display text-[clamp(44px,7vw,80px)] leading-[1.02] tracking-[-0.03em]">
          Bring the outside in.
        </h1>
        <p className="max-w-[32em] text-lg leading-relaxed text-muted">
          Houseplants, herbs, succulents and fruiting trees — every listing tells you how much light and water it needs,
          so you can pick plants that will thrive where you live.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/#best-sellers" className="btn-primary h-[52px] px-7">
            Shop best sellers
          </Link>
          <Link to="/#bundles" className="btn-outline h-[52px] px-7">
            Explore bundles
          </Link>
        </div>
      </div>

      {main ? (
        <div className="relative grid animate-fade-up grid-cols-2 gap-4 [animation-delay:120ms]">
          <img
            src={cld(main.image, { w: 640, h: 1040 })}
            alt={main.name}
            className="row-span-2 h-[380px] w-full rounded-[28px] object-cover sm:h-[520px]"
          />
          {[second, third].filter(Boolean).map((p) => (
            <img
              key={p._id}
              src={cld(p.image, { w: 640, h: 500 })}
              alt={p.name}
              className="h-[182px] w-full rounded-[28px] object-cover sm:h-[252px]"
            />
          ))}
          <Link
            to={`/product/${main._id}`}
            className="absolute bottom-4 left-4 flex items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-[0_12px_30px_rgba(31,42,30,0.16)] transition-transform hover:-translate-y-0.5 sm:bottom-5 sm:left-5 sm:px-5"
          >
            <span className="flex flex-col">
              <span className="text-[15px] font-bold text-ink">{main.name}</span>
              {main.care && (
                <span className="text-[13px] text-muted">
                  {main.care.light} · {main.care.level}
                </span>
              )}
            </span>
            <span className="font-display text-xl font-semibold text-ink">{formatCurrency(main.price)}</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4" aria-hidden="true">
          <div className="row-span-2 h-[380px] animate-pulse rounded-[28px] bg-placeholder sm:h-[520px]" />
          <div className="h-[182px] animate-pulse rounded-[28px] bg-placeholder sm:h-[252px]" />
          <div className="h-[182px] animate-pulse rounded-[28px] bg-placeholder sm:h-[252px]" />
        </div>
      )}
    </section>
  )
}

export default Hero
