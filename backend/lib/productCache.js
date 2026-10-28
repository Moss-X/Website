import crypto from 'crypto'
import { redis } from './redis.js'

const TTL_SECONDS = 300
const JITTER_SECONDS = 60
const REDIS_TIMEOUT_MS = 250
const VERSION_KEY = 'products:version'
export const FEATURED_KEY = 'featured_products'

// Redis must never take the storefront down: slow or failing calls count as a cache miss.
const guarded = (promise) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('redis timeout')), REDIS_TIMEOUT_MS))
  ])

// Random jitter on the expiry stops every key written together from expiring together.
export const ttlWithJitter = () => TTL_SECONDS + Math.floor(Math.random() * JITTER_SECONDS)

async function currentVersion() {
  return (await guarded(redis.get(VERSION_KEY))) || '0'
}

// Cache-aside: serve from Redis when present, otherwise run the loader and store its result.
// Keys carry a version so that one INCR in invalidateProductCache() retires every listing,
// category and search entry at once; the orphaned entries then age out via their TTL.
export async function cachedProducts(scope, params, loader) {
  let key
  try {
    const hash = crypto.createHash('sha1').update(JSON.stringify(params)).digest('hex').slice(0, 16)
    key = `products:v${await currentVersion()}:${scope}:${hash}`
    const hit = await guarded(redis.get(key))
    if (hit) return JSON.parse(hit)
  } catch (error) {
    console.log('Redis unavailable, falling back to MongoDB', error.message)
    key = null
  }

  const data = await loader()
  if (key) guarded(redis.set(key, JSON.stringify(data), 'EX', ttlWithJitter())).catch(() => {})
  return data
}

// Called on every product create, update and delete.
export async function invalidateProductCache() {
  try {
    await guarded(Promise.all([redis.incr(VERSION_KEY), redis.del(FEATURED_KEY)]))
  } catch (error) {
    console.log('Could not invalidate product cache', error.message)
  }
}
