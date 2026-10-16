// Builds a case-insensitive regex from user input with all metacharacters escaped,
// so queries like "c++" or "(" can't throw or trigger catastrophic backtracking.
export const searchRegex = (q) =>
  new RegExp(
    String(q)
      .slice(0, 100)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    'i'
  )

export const priceFilter = (minPrice, maxPrice) => {
  const filter = {}
  if (minPrice !== undefined && minPrice !== '' && !isNaN(minPrice)) filter.$gte = Number(minPrice)
  if (maxPrice !== undefined && maxPrice !== '' && !isNaN(maxPrice)) filter.$lte = Number(maxPrice)
  return Object.keys(filter).length ? filter : null
}
