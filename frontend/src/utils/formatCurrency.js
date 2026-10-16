const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })

// ₹1,299 for whole amounts, ₹1,299.50 otherwise.
export function formatCurrency(amount) {
  const n = Number(amount)
  if (!Number.isFinite(n)) return '₹0'
  return Number.isInteger(n) ? inr.format(n).replace(/\.00$/, '') : inr.format(n)
}
