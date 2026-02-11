import express from "express"
import {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  searchCollections
} from "../controllers/collection.controller.js"
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/", getAllCollections)
router.get("/search", searchCollections)
router.get("/:id", getCollectionById)
router.post("/", protectRoute, adminRoute, createCollection)
router.put("/:id", protectRoute, adminRoute, updateCollection)
router.delete("/:id", protectRoute, adminRoute, deleteCollection)

export default router 