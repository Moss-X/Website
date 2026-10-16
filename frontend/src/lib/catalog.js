export const CATEGORIES = [
  { name: 'Ornamental Houseplants', short: 'Houseplants', slug: 'ornamental-houseplants' },
  { name: 'Indoor Air-Purifying Plants', short: 'Air-Purifying', slug: 'indoor-air-purifying-plants' },
  { name: 'Herbs and Edible Plants', short: 'Herbs & Edibles', slug: 'herbs-and-edible-plants' },
  { name: 'Succulents and Cacti', short: 'Succulents & Cacti', slug: 'succulents-and-cacti' },
  { name: 'Flowering Bedding Plants', short: 'Flowering', slug: 'flowering-bedding-plants' },
  { name: 'Fruit Trees and Bushes', short: 'Fruit Plants', slug: 'fruit-trees-and-bushes' },
  { name: 'Vegetable Plants and Seedlings', short: 'Vegetable Seedlings', slug: 'vegetable-plants-and-seedlings' }
]

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name)

export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug)
export const categoryByName = (name) => CATEGORIES.find((c) => c.name === name)

// Price a cart line the same way the server does.
export const unitPrice = (item) => {
  if (item.type === 'bundle') return item.discountedPrice ?? 0
  if (item.type === 'collection') return item.totalPrice ?? 0
  return item.price ?? 0
}

export const itemTitle = (item) => item.name || item.title
export const itemHref = (item) =>
  item.type === 'bundle'
    ? `/bundle/${item._id}`
    : item.type === 'collection'
      ? `/collections/${item._id}`
      : `/product/${item._id}`
