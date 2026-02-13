import { useState } from 'react'
import { LogIn, Mail, Lock, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../../stores/useUserStore'
import InputField from './InputField'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login, loading } = useUserStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }

  const handleForgotPassword = () => {}

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        id="email"
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={Mail}
        placeholder="you@example.com"
      />

      <InputField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={Lock}
        placeholder="••••••••"
      />

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
  )
}

export default LoginForm
