import express from "express"
import {
  createBundle,
  getAllBundles,
  getBundleById,
  updateBundle,
  deleteBundle,
  searchBundles
} from "../controllers/bundle.controller.js"
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/", getAllBundles)
router.get("/search", searchBundles)
router.get("/:id", getBundleById)
router.post("/", protectRoute, adminRoute, createBundle)
router.put("/:id", protectRoute, adminRoute, updateBundle)
router.delete("/:id", protectRoute, adminRoute, deleteBundle)

export default router 