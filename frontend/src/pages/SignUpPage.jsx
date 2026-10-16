import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Lock, Mail, User } from 'lucide-react'
import { useUserStore } from '../stores/useUserStore'
import AuthLayout from '../components/auth/AuthLayout'
import InputField from '../components/auth/InputField'

const SignUpPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const { signup, loading } = useUserStore()
  const set = (key) => (e) => setFormData((f) => ({ ...f, [key]: e.target.value }))
  const mismatch = formData.confirmPassword && formData.password !== formData.confirmPassword

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Save your cart across devices and check out faster."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-moss hover:text-forest">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          signup(formData)
        }}
      >
        <InputField
          id="name"
          label="Full name"
          autoComplete="name"
          value={formData.name}
          onChange={set('name')}
          icon={User}
        />
        <InputField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={set('email')}
          icon={Mail}
          placeholder="you@example.com"
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          value={formData.password}
          onChange={set('password')}
          icon={Lock}
          aria-describedby="password-hint"
        />
        <p id="password-hint" className="-mt-3 text-sm text-muted">
          At least 6 characters.
        </p>
        <InputField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={set('confirmPassword')}
          icon={Lock}
          aria-invalid={Boolean(mismatch)}
        />
        {mismatch && <p className="-mt-3 text-sm text-clay">Passwords don&apos;t match yet.</p>}
        <button type="submit" className="btn-primary mt-2 h-[52px]" disabled={loading || mismatch}>
          {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default SignUpPage
