import { cld } from '../../lib/image'

function DetailImage({ src, alt, credit }) {
  return (
    <figure className="flex flex-col gap-2.5 lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-[28px] bg-placeholder">
        <img src={cld(src, { w: 1000, h: 1000 })} alt={alt} className="aspect-square w-full object-cover" />
      </div>
      {credit?.source && (
        <figcaption className="text-xs text-muted">
          Photo:{' '}
          <a href={credit.source} target="_blank" rel="noreferrer" className="underline hover:text-ink">
            {credit.author}
          </a>{' '}
          · {credit.license}
        </figcaption>
      )}
    </figure>
  )
}

export default DetailImage
