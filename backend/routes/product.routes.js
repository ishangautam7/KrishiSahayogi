import express from "express";
import { getProducts, getProduct, createProduct } from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, upload.single("image"), createProduct);

export default router;
