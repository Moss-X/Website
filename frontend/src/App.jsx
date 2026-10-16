import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import CategoryPage from './pages/CategoryPage'
import BundlePage from './pages/BundlePage'
import ProductPage from './pages/ProductPage'
import CollectionPage from './pages/CollectionPage'
import SearchResultsPage from './pages/SearchResultsPage'
import CartPage from './pages/CartPage'
import PurchaseSuccessPage from './pages/PurchaseSuccessPage'
import PurchaseCancelPage from './pages/PurchaseCancelPage'
import NotFoundPage from './pages/NotFoundPage'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import DisclaimerModal from './components/DisclaimerModal'
import LoadingSpinner from './components/loading/LoadingSpinner'
import { useUserStore } from './stores/useUserStore'
import { useCartStore } from './stores/useCartStore'

// The admin dashboard pulls in recharts; keep it out of the storefront bundle.
const AdminPage = lazy(() => import('./pages/AdminPage'))

const AUTH_ROUTES = ['/login', '/signup']

// Scrolls to the top on navigation, or to #section links once that section has rendered.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    let tries = 0
    const timer = setInterval(() => {
      const el = document.getElementById(hash.slice(1))
      if (el || ++tries > 30) {
        clearInterval(timer)
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
    return () => clearInterval(timer)
  }, [pathname, hash])
  return null
}

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore()
  const { getCartItems, initializeSession } = useCartStore()
  const location = useLocation()
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (checkingAuth) return
    initializeSession()
    getCartItems()
  }, [user, checkingAuth, initializeSession, getCartItems])

  if (checkingAuth) return <LoadingSpinner />

  return (
    <div className="flex min-h-screen flex-col bg-ground text-ink">
      <ScrollManager />
      <DisclaimerModal />
      {!isAuthRoute && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route
              path="/secret-dashboard"
              element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/login" />}
            />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/bundle/:id" element={<BundlePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/collections/:id" element={<CollectionPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/purchase-success" element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />} />
            <Route path="/purchase-cancel" element={<PurchaseCancelPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {!isAuthRoute && <Footer />}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: '#1F2A1E', color: '#FBF8F3', borderRadius: '999px', padding: '10px 18px' },
          success: { iconTheme: { primary: '#C0D3BB', secondary: '#1F2A1E' } }
        }}
      />
    </div>
  )
}

export default App
