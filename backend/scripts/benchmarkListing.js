// Load-tests the product listing endpoints with autocannon. Run it twice, against a build without
// the Redis cache and one with it, and compare:
//
//   MONGO_URI=mongodb://127.0.0.1:27018/bench UPSTASH_REDIS_URL=redis://127.0.0.1:6380 PORT=5055 node backend/server.js
//   BENCH_SEED=2000 node backend/scripts/benchmarkListing.js http://127.0.0.1:5055
//
// BENCH_SEED inserts that many synthetic products first. It refuses to touch a non-local database.
import autocannon from 'autocannon'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Product from '../models/product.model.js'

dotenv.config()

const baseUrl = process.argv[2] || 'http://127.0.0.1:5000'
const seedCount = Number(process.env.BENCH_SEED || 0)
const duration = Number(process.env.BENCH_SECONDS || 15)
const connections = Number(process.env.BENCH_CONNECTIONS || 50)

const CATEGORIES = [
  'Ornamental Houseplants',
  'Flowering Bedding Plants',
  'Herbs and Edible Plants',
  'Succulents and Cacti',
  'Fruit Trees and Bushes',
  'Vegetable Plants and Seedlings',
  'Indoor Air-Purifying Plants'
]

const ENDPOINTS = [
  { name: 'category listing', path: '/api/products/category/succulents-and-cacti' },
  { name: 'search', path: '/api/products/search?q=plant&category=Succulents%20and%20Cacti,Ornamental%20Houseplants' }
]

async function seed() {
  const uri = process.env.MONGO_URI || ''
  if (!/(127\.0\.0\.1|localhost)/.test(uri)) throw new Error('Refusing to seed a non-local database')
  await mongoose.connect(uri)
  await Product.deleteMany({ name: /^Bench plant / })
  await Product.insertMany(
    Array.from({ length: seedCount }, (_, i) => ({
      name: `Bench plant ${i}`,
      botanicalName: `Plantus benchmarkii ${i}`,
      description: `A hardy, easy-care plant used for load testing. Variant ${i}. `.repeat(6),
      price: 99 + (i % 900),
      image: `https://example.com/images/plant-${i}.jpg`,
      category: CATEGORIES[i % CATEGORIES.length],
      isFeatured: i % 25 === 0,
      care: { light: 'Bright indirect light', water: 'Water when the top inch is dry', level: 'Easy' }
    }))
  )
  await mongoose.disconnect()
  console.log(`Seeded ${seedCount} products`)
}

async function bench({ name, path }) {
  const result = await autocannon({ url: baseUrl + path, connections, duration })
  return {
    endpoint: name,
    requestsPerSec: result.requests.average,
    latencyAvgMs: result.latency.average,
    latencyP50Ms: result.latency.p50,
    latencyP99Ms: result.latency.p99,
    non2xx: result.non2xx
  }
}

if (seedCount > 0) await seed()
const rows = []
for (const endpoint of ENDPOINTS) {
  await bench(endpoint) // warm-up so the cached run is measured hot and the uncached one is not cold
  rows.push(await bench(endpoint))
}
console.table(rows)
