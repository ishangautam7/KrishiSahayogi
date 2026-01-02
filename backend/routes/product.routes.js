import express from "express";
import { getProducts, getProduct, createProduct } from "../controllers/product.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, createProduct);

export default router;
