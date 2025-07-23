import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useState, useRef, useEffect } from "react";
import axios from "../lib/axios";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  // Search state
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debounceRef = useRef();

  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`/products/search?q=${encodeURIComponent(search)}`);
        setSuggestions(res.data);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  function handleInputFocus() {
    setShowOverlay(true);
  }
  function handleInputBlur() {
    setTimeout(() => setShowOverlay(false), 150); // allow click on suggestion
  }
  function handleInputChange(e) {
    setSearch(e.target.value);
    setActiveIndex(-1);
  }
  function handleSuggestionClick(id) {
    setShowOverlay(false);
    setSearch("");
    setSuggestions([]);
    navigate(`/product/${id}`);
  }
  function handleKeyDown(e) {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      setActiveIndex(i => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex(i => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        handleSuggestionClick(suggestions[activeIndex]._id);
      } else {
        setShowOverlay(false);
        navigate(`/search?q=${encodeURIComponent(search)}`);
        setSuggestions([]);
      }
    }
  }

  return (
    <>
      {showOverlay && (
        <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={() => setShowOverlay(false)} />
      )}
      <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-50 transition-all duration-300 border-b border-emerald-800'>
        <div className='container mx-auto px-4 py-3'>
          <div className='flex flex-wrap justify-between items-center'>
            <Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
              <div className="flex items-center ">
                <img src='/icon.png' alt='Moss-x logo' className='w-14 h-14 object-contain' />
              </div>
            </Link>
            {/* Centered Search Bar */}
            <div className="flex-1 flex justify-center items-center relative z-50">
              <div className="w-full max-w-md relative">
                <div className="flex items-center bg-gray-800 rounded-lg px-3 py-1 border border-gray-700 focus-within:ring-2 focus-within:ring-emerald-500">
                  <Search className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Search plants..."
                    className="bg-transparent outline-none border-none text-white w-full py-2 placeholder-gray-400"
                    aria-label="Search plants"
                  />
                </div>
                {showOverlay && search && (
                  <div className="absolute left-0 right-0 mt-2 bg-gray-900 rounded-lg shadow-lg border border-gray-700 z-50 max-h-72 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-gray-400 text-center">Loading...</div>
                    ) : suggestions.length === 0 ? (
                      <div className="p-4 text-gray-400 text-center">No results found</div>
                    ) : (
                      suggestions.map((s, i) => (
                        <div
                          key={s._id}
                          className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-800 ${i === activeIndex ? "bg-gray-800" : ""}`}
                          onMouseDown={() => handleSuggestionClick(s._id)}
                          tabIndex={0}
                        >
                          <img src={s.image} alt={s.name} className="w-8 h-8 object-cover rounded" />
                          <span className="text-white font-medium line-clamp-1">{s.name}</span>
                          <span className="text-xs text-gray-400 ml-auto">${s.price}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <nav className='flex flex-wrap items-center gap-4'>
              <Link
                to={"/"}
                className='text-gray-300 hover:text-emerald-400 transition duration-300
             ease-in-out'
              >
                Home
              </Link>
              {user && (
                <Link
                  to={"/cart"}
                  className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 
                ease-in-out'
                >
                  <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
                  <span className='hidden sm:inline'>Cart</span>
                  {cart.length > 0 && (
                    <span
                      className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
                    text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
                    >
                      {cart.length}
                    </span>
                  )}
                </Link>
              )}
              {isAdmin && (
                <Link
                  className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
                   transition duration-300 ease-in-out flex items-center'
                  to={"/secret-dashboard"}
                >
                  <Lock className='inline-block mr-1' size={18} />
                  <span className='hidden sm:inline'>Dashboard</span>
                </Link>
              )}
              {!user && (
                <>
                  <Link
                    to='/signup'
                    className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
                  >
                    <UserPlus className='inline-block mr-1' size={20} />
                    <span className='hidden sm:inline'>Sign Up</span>
                  </Link>
                  <Link
                    to='/login'
                    className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
                  >
                    <LogIn className='inline-block mr-1' size={20} />
                    <span className='hidden sm:inline'>Login</span>
                  </Link>
                </>
              )}
              {user && (
                <button
                  onClick={logout}
                  className='text-gray-300 hover:text-red-400 transition duration-300 ease-in-out flex items-center'
                >
                  <LogOut className='inline-block mr-1' size={20} />
                  <span className='hidden sm:inline'>Logout</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
