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
const authAdmin=(req,res,next)=>{
  if(req.session.usuario.rol=="admin"){
    res.redirect("/perfil?error=Usted no tiene el rol indicado para ingresar a dicha seccion")
    return
  }
  next()
}
const authUser=(req,res,next)=>{
  if(req.session.usuario.rol=="usuario"){
    res.redirect("/perfil?error=Usted no tiene el rol indicado para ingresar a dicha seccion")
    return
  }
  next()
}
// Ruta principal
router.get("/", ProductsControllers.home);

router.get("/ingresarProductos",auth ,authUser, ProductsControllers.renderCreateProducts);

router.get("/productos", auth, authAdmin ,ProductsControllers.loadProducts);

router.get("/carts/:cid", CartsControllers.renderCart );

router.get("/chat",auth ,authAdmin ,OthersControllers.renderChat );

router.get("/login", UsersControllers.renderLoginUser);

router.get("/registro", UsersControllers.renderRegisterUser);

router.get("/perfil", auth, OthersControllers.renderProfile)

router.get("/mockingproducts", OthersControllers.mock)
export default router;
