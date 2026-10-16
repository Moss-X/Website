import { useState } from 'react'

const EMPTY = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India'
}

const FIELDS = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name', span: 1 },
  { name: 'phone', label: 'Phone number', autoComplete: 'tel', type: 'tel', inputMode: 'numeric', span: 1 },
  { name: 'addressLine1', label: 'Address line 1', autoComplete: 'address-line1', span: 2 },
  { name: 'addressLine2', label: 'Address line 2 (optional)', autoComplete: 'address-line2', span: 2, optional: true },
  { name: 'city', label: 'City', autoComplete: 'address-level2', span: 1 },
  { name: 'state', label: 'State', autoComplete: 'address-level1', span: 1 },
  { name: 'postalCode', label: 'PIN code', autoComplete: 'postal-code', inputMode: 'numeric', span: 1 }
]

function validate(data) {
  const errors = {}
  for (const f of FIELDS) {
    if (!f.optional && !String(data[f.name] || '').trim()) errors[f.name] = `${f.label} is required`
  }
  if (data.phone && !/^[6-9]\d{9}$/.test(data.phone.replace(/[\s-]/g, '').replace(/^\+?91/, '')))
    errors.phone = 'Enter a valid 10-digit mobile number'
  if (data.postalCode && !/^\d{6}$/.test(data.postalCode.trim())) errors.postalCode = 'Enter a valid 6-digit PIN code'
  return errors
}

const ShippingAddressForm = ({ initial, onAddressSubmit }) => {
  const [formData, setFormData] = useState({ ...EMPTY, ...(initial || {}) })
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate(formData)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      onAddressSubmit({ ...formData, phone: formData.phone.replace(/[\s-]/g, '').replace(/^\+?91/, '') })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      {FIELDS.map((f) => (
        <div key={f.name} className={f.span === 2 ? 'sm:col-span-2' : ''}>
          <label htmlFor={f.name} className="mb-1.5 block text-sm font-medium">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type={f.type || 'text'}
            inputMode={f.inputMode}
            autoComplete={f.autoComplete}
            value={formData[f.name]}
            onChange={handleInputChange}
            aria-invalid={Boolean(errors[f.name])}
            aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
            className={`field ${errors[f.name] ? 'border-clay' : ''}`}
          />
          {errors[f.name] && (
            <p id={`${f.name}-error`} className="mt-1 text-sm text-clay">
              {errors[f.name]}
            </p>
          )}
        </div>
      ))}
      <div>
        <label htmlFor="country" className="mb-1.5 block text-sm font-medium">
          Country
        </label>
        <input id="country" value="India" readOnly className="field bg-ground text-muted" />
      </div>
      <button type="submit" className="btn-primary h-[52px] sm:col-span-2">
        Save and continue
      </button>
    </form>
  )
}

export default ShippingAddressForm
