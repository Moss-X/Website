import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Lock, Mail } from 'lucide-react'
import { useUserStore } from '../stores/useUserStore'
import AuthLayout from '../components/auth/AuthLayout'
import InputField from '../components/auth/InputField'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading } = useUserStore()

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to check out and see your saved cart."
      footer={
        <>
          New to Moss X?{' '}
          <Link to="/signup" className="font-bold text-moss hover:text-forest">
            Create an account
          </Link>
        </>
      }
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          login(email, password)
        }}
      >
        <InputField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          placeholder="you@example.com"
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
        />
        <button type="submit" className="btn-primary mt-2 h-[52px]" disabled={loading}>
          {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
