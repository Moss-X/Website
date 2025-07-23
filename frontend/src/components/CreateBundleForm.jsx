import { useState, useEffect } from "react"
import { useBundleStore } from "../stores/useBundleStore"
import axios from "../lib/axios"

function CreateBundleForm() {
  const [form, setForm] = useState({ title: "", description: "", products: [], discountedPrice: "" })
  const [products, setProducts] = useState([])
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [image, setImage] = useState("")
  const { createBundle, loading } = useBundleStore()

  useEffect(() => {
    axios.get("/products").then(res => setProducts(res.data.products)).catch(() => setProducts([]))
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleProductSelect(id) {
    setForm(f => ({
      ...f,
      products: f.products.includes(id)
        ? f.products.filter(pid => pid !== id)
        : [...f.products, id]
    }))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSuccess("")
    setError("")
    const res = await createBundle({
      ...form,
      discountedPrice: Number(form.discountedPrice),
      image
    })
    if (res.success) {
      setSuccess("Bundle created successfully!")
      setForm({ title: "", description: "", products: [], discountedPrice: "" })
      setImage("")
    } else {
      setError(res.error || "Failed to create bundle")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 max-w-xl mx-auto flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-emerald-300 mb-2">Create Bundle</h2>
      {success && <div className="text-green-400">{success}</div>}
      {error && <div className="text-red-400">{error}</div>}
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="bg-gray-700 rounded px-3 py-2 text-white"
        required
      />
      <p className="text-xs text-gray-400 mb-1">The first character should be uppercase.</p>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="bg-gray-700 rounded px-3 py-2 text-white"
        required
      />
      <input
        name="discountedPrice"
        value={form.discountedPrice}
        onChange={handleChange}
        type="number"
        min="0"
        placeholder="Discounted Price"
        className="bg-gray-700 rounded px-3 py-2 text-white"
        required
      />
      <div>
        <label className="block text-gray-300 font-medium mb-1">Bundle Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-400" required />
        <p className="text-xs text-gray-400 mt-1">For best results, use a 1:1 aspect ratio image.</p>
        {image && <img src={image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
      </div>
      <div>
        <div className="mb-1 text-gray-300 font-medium">Select Products</div>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {products.map(p => (
            <label key={p._id} className="flex items-center gap-2 text-gray-200">
              <input
                type="checkbox"
                checked={form.products.includes(p._id)}
                onChange={() => handleProductSelect(p._id)}
                className="accent-emerald-500"
              />
              {p.name}
            </label>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Bundle"}
      </button>
    </form>
  )
}

export default CreateBundleForm 