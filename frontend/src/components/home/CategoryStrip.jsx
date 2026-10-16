import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../lib/catalog'

function CategoryStrip() {
  return (
    <section aria-labelledby="categories-heading" className="container-page pb-16">
      <h2 id="categories-heading" className="eyebrow mb-5">
        Shop by category
      </h2>
      <div className="flex flex-wrap gap-2.5">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} to={`/category/${c.slug}`} className="chip">
            {c.short}
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoryStrip
