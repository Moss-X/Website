import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import CategoryPage from './pages/CategoryPage'
import BundlePage from './pages/BundlePage'
import ProductPage from './pages/ProductPage'
import CollectionPage from './pages/CollectionPage'
import SearchResultsPage from './pages/SearchResultsPage'

import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import { useUserStore } from './stores/useUserStore'
import { useEffect } from 'react'
import CartPage from './pages/CartPage'
import { useCartStore } from './stores/useCartStore'
import PurchaseSuccessPage from './pages/PurchaseSuccessPage'
import PurchaseCancelPage from './pages/PurchaseCancelPage'
import DisclaimerModal from './components/DisclaimerModal'
import LoadingSpinner from './components/loading/LoadingSpinner'
import Footer from './components/Footer'

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore()
  const { getCartItems, initializeSession } = useCartStore()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    initializeSession()

    if (user) {
      getCartItems()
    }
  }, [user])
  //  console.log('App checkingAuth:', checkingAuth)
  if (checkingAuth) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-white text-white relative overflow-hidden flex flex-col">
      <div className="relative z-50 flex-grow">
        <DisclaimerModal />
        {location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/secret-dashboard" element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/login" />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/bundle/:id" element={<BundlePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/collections/:id" element={<CollectionPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/purchase-success" element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />} />
          <Route path="/purchase-cancel" element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />} />
          <Route path="/loading" element={<LoadingSpinner />} />
        </Routes>
      </div>
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Footer />}
      <Toaster />
    </div>
  )
}

export default App
