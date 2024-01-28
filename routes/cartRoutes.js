import { Router } from "express";
import { CartsControllers } from "../controllers/carts.controllers.js";

const router = Router();

router.get("/", CartsControllers.loadCarts );

router.post("/", CartsControllers.postCreateCart );

router.get("/:cid", CartsControllers.GetCartId );

router.post("/:cid/product/:pid", CartsControllers.postAddProductToCart );

router.put("/:cid/product/:pid", CartsControllers.putUpdateQuantity);

router.put("/:cid", CartsControllers.putUpdateProduct );

router.delete("/:cid", CartsControllers.deleteTotalProducts);

router.delete("/:cid/product/:pid", CartsControllers.deleteOneProduct );

export default router;
