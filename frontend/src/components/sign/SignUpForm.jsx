import { useState } from 'react'
import { UserPlus, Mail, Lock, User, Loader } from 'lucide-react'
import { useUserStore } from '../../stores/useUserStore'
import InputField from './InputField'

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const { signup, loading } = useUserStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        id="name"
        label="Full name"
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        icon={User}
        placeholder="John Doe"
      />

      <InputField
        id="email"
        label="E-mail"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        icon={Mail}
        placeholder="you@example.com"
      />

      <InputField
        id="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        icon={Lock}
        placeholder="••••••••"
      />

      <InputField
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        icon={Lock}
        placeholder="••••••••"
      />

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent  rounded-md shadow-xs text-sm font-medium text-white bg-textGreen hover:bg-darkGreen focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Loading...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
            Sign up
          </>
        )}
      </button>
    </form>
  )
}

export default SignUpForm
