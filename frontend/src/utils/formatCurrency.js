export function formatCurrency(amount) {
  if (typeof amount !== "number") return "₹0.00";
  return `₹${amount.toFixed(2)}`;
}
