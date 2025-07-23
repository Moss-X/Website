import mongoose from "mongoose"

const collectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
  },
  { timestamps: true }
)

const Collection = mongoose.model("Collection", collectionSchema)

export default Collection 