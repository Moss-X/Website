// Seeds the store catalog (products, bundles, collections) with real plant photos.
//
//   pnpm seed                    # upsert everything (safe to re-run)
//   pnpm seed --replace-legacy   # also delete the old lorem-ipsum test bundles/collections
//
// Images are downloaded from Wikimedia Commons and uploaded to Cloudinary under `mossx/`.
// Already-uploaded images are reused, so re-running only touches the database.
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cloudinary from '../lib/cloudinary.js'
import Product from '../models/product.model.js'
import Bundle from '../models/bundle.model.js'
import Collection from '../models/collection.model.js'
import { products, bundles, collections, legacyTitles } from './catalog.data.js'

dotenv.config()

const USER_AGENT = 'MossXSeed/1.0 (https://github.com/ShouryaUpadhyaya; catalog seeding)'
const replaceLegacy = process.argv.includes('--replace-legacy')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const stripHtml = (s = '') => s.replace(/<[^>]*>/g, '').trim()

async function commonsInfo(fileTitle) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: fileTitle,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '960'
  })
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': USER_AGENT }
  })
  const page = Object.values((await res.json()).query.pages)[0]
  const info = page.imageinfo?.[0]
  if (!info) throw new Error(`Commons file not found: ${fileTitle}`)
  const meta = info.extmetadata || {}
  return {
    url: info.thumburl || info.url,
    credit: {
      author: stripHtml(meta.Artist?.value) || 'Wikimedia Commons contributor',
      license: stripHtml(meta.LicenseShortName?.value) || 'See source',
      source: info.descriptionurl
    }
  }
}

async function existingAsset(publicId) {
  try {
    return await cloudinary.api.resource(publicId)
  } catch {
    return null
  }
}

async function uploadBuffer(buffer, publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { public_id: publicId, overwrite: true, transformation: [{ width: 1200, crop: 'limit' }] },
        (err, r) => (err ? reject(err) : resolve(r))
      )
      .end(buffer)
  })
}

// Downloads a Commons photo and stores it in Cloudinary; returns { url, credit }.
async function photo(fileTitle, publicId) {
  const info = await commonsInfo(fileTitle)
  const existing = await existingAsset(publicId)
  if (existing) return { url: existing.secure_url, credit: info.credit }

  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(info.url, { headers: { 'User-Agent': USER_AGENT } })
    if (res.ok) {
      const uploaded = await uploadBuffer(Buffer.from(await res.arrayBuffer()), publicId)
      await sleep(400) // be gentle with Wikimedia
      return { url: uploaded.secure_url, credit: info.credit }
    }
    if (res.status !== 429) throw new Error(`Download failed (${res.status}) for ${fileTitle}`)
    await sleep(3000 * attempt)
  }
  throw new Error(`Rate limited downloading ${fileTitle}`)
}

// Builds a tiled collage of the bundle's product photos with Cloudinary overlays
// (tall left tile + stacked right tiles for 3 items, 2x2 grid for 4).
async function collage(publicIds, publicId) {
  const tile = 398
  const layer = (id) => id.replace(/\//g, ':')
  const tiles = publicIds.slice(0, 4)
  const transformation =
    tiles.length === 4
      ? [
          { width: tile, height: tile, crop: 'fill', gravity: 'auto' },
          { width: 800, height: 800, crop: 'pad', gravity: 'north_west', background: 'rgb:F4EFE6' },
          ...['north_east', 'south_west', 'south_east'].flatMap((g, i) => [
            { overlay: layer(tiles[i + 1]), width: tile, height: tile, crop: 'fill', gravity: 'auto' },
            { flags: 'layer_apply', gravity: g }
          ])
        ]
      : [
          { width: tile, height: 800, crop: 'fill', gravity: 'auto' },
          { width: 800, height: 800, crop: 'pad', gravity: 'west', background: 'rgb:F4EFE6' },
          ...['north_east', 'south_east'].flatMap((g, i) => [
            {
              overlay: layer(tiles[i + 1]),
              width: tile,
              height: tiles.length === 2 ? 800 : tile,
              crop: 'fill',
              gravity: 'auto'
            },
            { flags: 'layer_apply', gravity: tiles.length === 2 ? 'east' : g }
          ])
        ]
  const url = cloudinary.url(tiles[0], { secure: true, format: 'jpg', transformation })
  const uploaded = await cloudinary.uploader.upload(url, { public_id: publicId, overwrite: true })
  return uploaded.secure_url
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  const bySlug = {}
  for (const p of products) {
    const publicId = `mossx/products/${p.slug}`
    const { url, credit } = await photo(p.commonsFile, publicId)
    const { slug, commonsFile, ...fields } = p
    const doc = await Product.findOneAndUpdate(
      { name: p.name },
      { ...fields, isFeatured: Boolean(p.isFeatured), image: url, imageCredit: credit },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    bySlug[slug] = { doc, publicId }
    console.log(`  product  ${p.name}`)
  }

  if (replaceLegacy) {
    const b = await Bundle.deleteMany({ title: { $in: legacyTitles.bundles } })
    const c = await Collection.deleteMany({ title: { $in: legacyTitles.collections } })
    console.log(`Removed ${b.deletedCount} legacy bundles, ${c.deletedCount} legacy collections`)
  }

  const resolve = (slugs) =>
    slugs.map((s) => {
      if (!bySlug[s]) throw new Error(`Unknown product slug ${s}`)
      return bySlug[s]
    })

  for (const b of bundles) {
    const items = resolve(b.products)
    const totalPrice = items.reduce((sum, i) => sum + i.doc.price, 0)
    const image = await collage(
      items.map((i) => i.publicId),
      `mossx/bundles/${b.slug}`
    )
    await Bundle.findOneAndUpdate(
      { title: b.title },
      {
        title: b.title,
        description: b.description,
        products: items.map((i) => i.doc._id),
        totalPrice,
        discountedPrice: b.discountedPrice,
        image
      },
      { upsert: true, new: true }
    )
    console.log(`  bundle   ${b.title} (₹${b.discountedPrice} / ₹${totalPrice})`)
  }

  for (const c of collections) {
    const items = resolve(c.products)
    const { url, credit } = await photo(c.commonsFile, `mossx/collections/${c.slug}`)
    await Collection.findOneAndUpdate(
      { title: c.title },
      {
        title: c.title,
        description: c.description,
        products: items.map((i) => i.doc._id),
        totalPrice: items.reduce((sum, i) => sum + i.doc.price, 0),
        image: url,
        imageCredit: credit
      },
      { upsert: true, new: true }
    )
    console.log(`  collection ${c.title}`)
  }

  // Listings, categories, search and featured products are cached in Redis; drop them so the
  // storefront picks up the new catalog.
  try {
    const { redis } = await import('../lib/redis.js')
    const { invalidateProductCache } = await import('../lib/productCache.js')
    await invalidateProductCache()
    redis.disconnect()
    console.log('Invalidated product cache')
  } catch (error) {
    console.warn('Could not refresh Redis cache:', error.message)
  }

  await mongoose.disconnect()
  console.log('Done.')
}

main().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect()
  process.exit(1)
})
