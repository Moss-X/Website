import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import axios from '../lib/axios'
import { cld } from '../lib/image'
import { formatCurrency } from '../utils/formatCurrency'
import { useUserStore } from '../stores/useUserStore'
import { useCartStore } from '../stores/useCartStore'

const NAV_LINKS = [
  { to: '/search', label: 'Shop all' },
  { to: '/#bundles', label: 'Bundles' },
  { to: '/#collections', label: 'Collections' }
]

function SearchBox({ onNavigate }) {
  const navigate = useNavigate()
  const location = useLocation()
  const listId = useId()
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef()

  // keep the box in sync with the results page query
  useEffect(() => {
    if (location.pathname === '/search') setSearch(new URLSearchParams(location.search).get('q') || '')
  }, [location.pathname, location.search])

  useEffect(() => {
    const q = search.trim()
    if (!q || !open) {
      setSuggestions([])
      setLoading(false)
      return
    }
    setLoading(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get('/products/search', { params: { q } })
        setSuggestions(res.data.slice(0, 6))
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => clearTimeout(debounceRef.current)
  }, [search, open])

  function go(path) {
    setOpen(false)
    setActiveIndex(-1)
    onNavigate?.()
    navigate(path)
  }

  function submit(e) {
    e.preventDefault()
    if (activeIndex >= 0 && suggestions[activeIndex]) return go(`/product/${suggestions[activeIndex]._id}`)
    const q = search.trim()
    go(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') return setOpen(false)
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
    }
  }

  const showPanel = open && search.trim()

  return (
    <form role="search" onSubmit={submit} className="relative w-full">
      <label className="flex h-11 items-center gap-2.5 rounded-full border border-line bg-surface px-4 focus-within:border-moss focus-within:ring-2 focus-within:ring-moss/20">
        <Search className="h-[18px] w-[18px] shrink-0 text-muted" aria-hidden="true" />
        <span className="sr-only">Search plants</span>
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setActiveIndex(-1)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Search monstera, tulsi, succulents…"
          className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted/80 [&::-webkit-search-cancel-button]:hidden"
          role="combobox"
          aria-expanded={Boolean(showPanel)}
          aria-controls={listId}
          aria-autocomplete="list"
        />
      </label>
      {showPanel && (
        <div
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_40px_rgba(31,42,30,0.14)]"
        >
          {loading && !suggestions.length ? (
            <p className="px-4 py-3 text-sm text-muted">Searching…</p>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">
              No plants match “{search.trim()}” — press Enter to search bundles too.
            </p>
          ) : (
            suggestions.map((s, i) => (
              <button
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                key={s._id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(`/product/${s._id}`)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-sage/60 ${i === activeIndex ? 'bg-sage/60' : ''}`}
              >
                <img src={cld(s.image, { w: 80, h: 80 })} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium text-ink">{s.name}</span>
                  <span className="truncate text-xs text-muted italic">{s.botanicalName || s.category}</span>
                </span>
                <span className="font-display text-sm font-semibold">{formatCurrency(s.price)}</span>
              </button>
            ))
          )}
          <button
            type="submit"
            onMouseDown={(e) => e.preventDefault()}
            className="block w-full border-t border-line px-4 py-2.5 text-left text-sm font-bold text-moss hover:bg-sage/60"
          >
            See all results for “{search.trim()}” →
          </button>
        </div>
      )}
    </form>
  )
}

const Navbar = () => {
  const { user, logout } = useUserStore()
  const cartCount = useCartStore((s) => s.cart.reduce((n, item) => n + item.quantity, 0))
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMenuOpen(false), [location.pathname, location.hash])

  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-[15px] font-medium transition-colors hover:bg-sage ${isActive && location.pathname !== '/' ? 'text-moss' : 'text-ink'}`

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ground/90 backdrop-blur-md">
      <div className="container-page flex flex-wrap items-center gap-x-4 gap-y-3 py-3">
        <Link to="/" className="flex items-center gap-2" aria-label="Moss X home">
          <img src="/icon.webp" alt="" className="h-9 w-9 object-contain" />
          <span className="font-display text-[26px] leading-none font-semibold tracking-[-0.02em]">
            Moss<span className="text-moss">X</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.label} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="order-last w-full md:order-none md:max-w-md md:flex-1">
          <SearchBox />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {user?.role === 'admin' && (
            <Link
              to="/secret-dashboard"
              className="hidden h-11 items-center gap-2 rounded-full px-3 text-[15px] font-medium hover:bg-sage sm:inline-flex"
            >
              <LayoutDashboard className="h-[18px] w-[18px]" aria-hidden="true" />
              Dashboard
            </Link>
          )}
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="hidden h-11 items-center gap-2 rounded-full px-3 text-[15px] font-medium hover:bg-sage sm:inline-flex"
            >
              <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden h-11 items-center gap-2 rounded-full px-3 text-[15px] font-medium hover:bg-sage sm:inline-flex"
            >
              <User className="h-[18px] w-[18px]" aria-hidden="true" />
              Sign in
            </Link>
          )}
          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-ground transition-colors hover:bg-forest"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-xs font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-sage lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile" className="border-t border-line bg-ground lg:hidden">
          <div className="container-page flex flex-col py-2">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="rounded-xl px-3 py-3 font-medium hover:bg-sage">
                {l.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/secret-dashboard" className="rounded-xl px-3 py-3 font-medium hover:bg-sage">
                Dashboard
              </Link>
            )}
            {user ? (
              <button
                type="button"
                onClick={logout}
                className="rounded-xl px-3 py-3 text-left font-medium hover:bg-sage"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" className="rounded-xl px-3 py-3 font-medium hover:bg-sage">
                  Sign in
                </Link>
                <Link to="/signup" className="rounded-xl px-3 py-3 font-medium hover:bg-sage">
                  Create account
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
