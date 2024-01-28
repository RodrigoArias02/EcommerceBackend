import express from "express";
import { UsersControllers } from "../controllers/usuarios.controllers.js";
import { ProductsControllers } from "../controllers/products.controllers.js";
import { CartsControllers } from "../controllers/carts.controllers.js";
import { OthersControllers } from "../controllers/other.controllers.js";


const router = express();

const auth=(req,res,next)=>{
  if(!req.session.usuario){
    res.redirect("/login?error=Su sesion expiro, ingrese nuevamente")
    return
  }

  next()
}

// Ruta principal
router.get("/", ProductsControllers.home);

router.get("/ingresarProductos", ProductsControllers.renderCreateProducts);

router.get("/productos", auth ,ProductsControllers.loadProducts);

router.get("/carts/:cid", CartsControllers.renderCart );

router.get("/chat", auth ,OthersControllers.renderChat );

router.get("/login", UsersControllers.renderLoginUser);

router.get("/registro", UsersControllers.renderRegisterUser);

router.get("/perfil", auth, OthersControllers.renderProfile)
export default router;
