import { Link } from 'react-router-dom'
import { cld } from '../../lib/image'

function CollectionCard({ collection }) {
  return (
    <Link
      to={`/collections/${collection._id}`}
      className="group relative block h-[420px] overflow-hidden rounded-[26px] bg-night text-white"
    >
      <img
        src={cld(collection.image, { w: 720, h: 840 })}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-[rgba(16,24,15,0.94)] via-[rgba(16,24,15,0.75)] to-transparent p-7 pt-32">
        <span className="heading-display text-[28px] leading-tight">{collection.title}</span>
        <span className="line-clamp-2 text-[15px] leading-relaxed text-sage">{collection.description}</span>
        <span className="mt-1 text-sm font-bold text-sage-strong">
          Shop {collection.products?.length} plants <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  )
}

export default CollectionCard
