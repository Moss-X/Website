import { Link } from 'react-router-dom'
import { CATEGORIES } from '../lib/catalog'

function Footer() {
  return (
    <footer className="mt-auto bg-ink text-[#C9D3C4]">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <span className="font-display text-[28px] font-semibold text-ground">
            Moss<span className="text-sage-strong">X</span>
          </span>
          <p className="max-w-xs leading-relaxed">Making homes greener, one plant at a time.</p>
        </div>
        <nav aria-label="Shop by category" className="flex flex-col gap-2.5">
          <span className="font-bold text-ground">Categories</span>
          {CATEGORIES.slice(0, 5).map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}`} className="hover:text-ground">
              {c.short}
            </Link>
          ))}
        </nav>
        <nav aria-label="Shop" className="flex flex-col gap-2.5">
          <span className="font-bold text-ground">Shop</span>
          <Link to="/search" className="hover:text-ground">
            All plants
          </Link>
          <Link to="/#bundles" className="hover:text-ground">
            Bundles
          </Link>
          <Link to="/#collections" className="hover:text-ground">
            Collections
          </Link>
        </nav>
        <nav aria-label="Account" className="flex flex-col gap-2.5">
          <span className="font-bold text-ground">Account</span>
          <Link to="/login" className="hover:text-ground">
            Sign in
          </Link>
          <Link to="/signup" className="hover:text-ground">
            Create account
          </Link>
          <Link to="/cart" className="hover:text-ground">
            Cart
          </Link>
        </nav>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-[#34432F] py-6 text-sm sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Moss X. All rights reserved.</span>
        <span>Plant photography by Wikimedia Commons contributors, credited on each product.</span>
      </div>
    </footer>
  )
}

export default Footer
