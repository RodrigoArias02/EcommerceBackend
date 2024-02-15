import { Router } from "express";
import { ProductsControllers } from "../controllers/products.controllers.js";
const router = Router();

// Ruta final de respuesta al cliente
router.get("/", ProductsControllers.getProducts );

// Ruta final de respuesta al cliente
router.get("/:pid", ProductsControllers.getProductId );

router.post("/", ProductsControllers.postCreateProduct )

router.put("/:pid", ProductsControllers.putUpdateProduct )

router.delete("/:pid", ProductsControllers.deleteProduct );

export default router;
