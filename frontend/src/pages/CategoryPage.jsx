import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProductStore } from '../stores/useProductStore'
import { CATEGORIES, categoryBySlug } from '../lib/catalog'
import ProductCard from '../components/ProductCard'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import NotFoundPage from './NotFoundPage'

const CategoryPage = () => {
  const { category: slug } = useParams()
  const { fetchProductsByCategory, products, loading } = useProductStore()
  const category = categoryBySlug(slug)

  useEffect(() => {
    if (category) fetchProductsByCategory(slug)
  }, [fetchProductsByCategory, slug, category])

  if (!category) return <NotFoundPage title="Category not found" />

  return (
    <div className="container-page pt-10 pb-24">
      <header className="mb-8 flex flex-col gap-3">
        <p className="eyebrow">Category</p>
        <h1 className="heading-display text-[44px] leading-tight sm:text-[56px]">{category.name}</h1>
        {!loading && (
          <p className="text-muted">
            {products.length} plant{products.length === 1 ? '' : 's'}
          </p>
        )}
      </header>

      <nav aria-label="Other categories" className="mb-10 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            to={`/category/${c.slug}`}
            aria-current={c.slug === slug ? 'page' : undefined}
            className={`chip shrink-0 ${c.slug === slug ? 'bg-ink text-ground hover:bg-ink' : ''}`}
          >
            {c.short}
          </Link>
        ))}
      </nav>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
        {loading ? <ProductGridSkeleton count={8} /> : products.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
      {!loading && products.length === 0 && (
        <p className="py-16 text-center text-lg text-muted">No plants in this category yet — check back soon.</p>
      )}
    </div>
  )
}

export default CategoryPage
