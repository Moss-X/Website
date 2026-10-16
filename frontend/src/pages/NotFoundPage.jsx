import { Link } from 'react-router-dom'

function NotFoundPage({ title = 'This page has gone to seed', message }) {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="heading-display text-4xl sm:text-5xl">{title}</h1>
      <p className="max-w-md text-lg text-muted">
        {message || "We couldn't find what you were looking for. It may have been moved or sold out."}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          Back to home
        </Link>
        <Link to="/search" className="btn-outline">
          Browse all plants
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
