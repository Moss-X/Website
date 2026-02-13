import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { LogIn, Mail, Lock, ArrowRight, Loader } from 'lucide-react'
import { useUserStore } from '../stores/useUserStore'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login, loading } = useUserStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(email, password)
    login(email, password)
  }

  const handleForgotPassword = () => {}

  return (
    <div className="flex flex-col pt-28 justify-center py-12 sm:px-6 lg:px-8">
      <div className="flex flex-row relative mt-8 w-[90%] mx-auto shadow-2xl sm:w-full sm:max-w-md  md:max-w-3xl">
        <div className="p-4 md:p-2 w-full md:w-[48%]">
          <div>
            <p className="ml-2 absolute font-bold text-2xl text-black">
              Moss <span className="text-textGreen">X</span>
            </p>
          </div>
          <div className="py-8 flex flex-col gap-8 sm:rounded-lg sm:px-6">
            <div>
              <p className="pt-8 text-black text-3xl font-bold">Sign-In</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-2">
              <p className="text-red-700 text-sm font-medium">
                Warning: Do not add personal details as they might be stored in our database.
                <br />
                Contact us to remove yourself.
              </p>
            </div>

            <div>
              <p className="text-black opacity-70 text-sm font-medium">
                Don&apos;t have an account?
                <span>
                  {' '}
                  <Link to="/signup" className="font-medium text-textGreen hover:opacity-70">
                    Create Now
                  </Link>
                </span>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black opacity-70 mb-2">
                  E-mail
                </label>
                <div className="mt-1 relative rounded-md shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className=" block w-full px-3 py-2 pl-10 border border-darkGray  
									rounded-md shadow-xs text-black
									placeholder-gray-400 focus:outline-hidden focus:ring-black 
									 focus:border-black sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black opacity-70 mb-2">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className=" block w-full px-3 py-2 pl-10 border border-darkGray  
									rounded-md shadow-xs text-black
									 placeholder-gray-400 focus:outline-hidden focus:ring-black 
									 focus:border-black sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <Link to="#" className="font-medium text-textGreen hover:opacity-70" onClick={handleForgotPassword}>
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-xs text-sm font-medium text-white bg-textGreen
							 hover:bg-darkGreen focus:outline-hidden focus:ring-2 focus:ring-offset-2
							 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                    Loading...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                    Login
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="relative hidden md:block w-[52%] h-auto bg-darkGreen overflow-hidden">
          <img src="/leaf-pattern.avif" alt="Leaf Pattern" className="w-full h-full object-cover object-center " />
          <div className="absolute bottom-2 right-4 text-White font-bold text-6xl">
            <p>
              Moss <span>X</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoginPage
