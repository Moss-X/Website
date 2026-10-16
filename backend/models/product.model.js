import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      min: 0,
      required: true
    },
    image: {
      type: String,
      required: [true, 'Image is required']
    },
    category: {
      type: String,
      required: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    botanicalName: String,
    care: {
      light: String,
      water: String,
      level: String
    },
    imageCredit: {
      author: String,
      license: String,
      source: String
    }
  },
  { timestamps: true }
)

productSchema.index({ category: 1 })
productSchema.index({ isFeatured: 1 })

const Product = mongoose.model('Product', productSchema)

export default Product
