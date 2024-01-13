import express from "express";
import { ManagerProductsMongoDB } from "../dao/managerProductsMongo.js";
import { ManagerCartMongoDB } from "../dao/managerCartsMongo.js";
import { ManagerChatMongoDB } from "../dao/managerChatMongo.js";
import moment from "moment";

function formatearHora(messages) {
  messages.map((message) => {
    message.formattedCreatedAt = moment(message.createdAt).format("HH:mm");
    return message;
  });
  return messages;
}
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import ProductManager from '../functions/functionProducts.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// let ruta = join(__dirname, "..", "archives", "products.json");
// let productManager = new ProductManager(ruta);

const manager = new ManagerProductsMongoDB();
const managerC = new ManagerCartMongoDB();
const managerChat = new ManagerChatMongoDB();
const router = express();

const auth=(req,res,next)=>{
  if(!req.session.usuario){
    res.redirect("/login?error=Su sesion expiro, ingrese nuevamente")
    return
  }

  next()
}

// Ruta principal
router.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  // const productos=productManager.getProduct()
  let categoria;
  let productos;
  let direccion;
  let pagina;
  if (req.query.category) {
    categoria = req.query.category;
  }
  if (req.query.pagina) {
    pagina = req.query.pagina;
  } else {
    pagina = 1;
  }
  if (req.query.direccion) {
    direccion = req.query.direccion;
  }

  try {
    productos = await manager.listProductsAggregate(
      categoria,
      pagina,
      direccion
    );
    if (productos.status == 200) {
      let {
        playload,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      } = productos;

      res.status(200).render("home", {
        playload,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage,
        totalPages,
        categoria,
        direccion,
        pagina,
        login: req.session.usuario?true:false
      });
    } else {
      res.status(500).send("Hubo un error");
    }
  } catch (error) {}
});

router.get("/ingresarProductos", async (req, res) => {
  // let productos=productManager.getProduct()
  const productos = await manager.listProducts();
  res.setHeader("Content-Type", "text/html");
  res.status(200).render("realTimesProducts", { productos: productos.docs });
});

router.get("/productos", auth ,async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  let pagina = 1;
  const usuario = req.session.usuario;
  if (req.query.pagina) {
    pagina = req.query.pagina;
  }

  let productos;
  try {
    productos = await manager.listProducts(pagina);
  } catch (error) {}
  let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = productos;
  res.status(200).render("productos", {
    productos: productos.docs,
    hasNextPage,
    hasPrevPage,
    prevPage,
    nextPage,
    totalPages,
    usuario,
    login:true
  });
});

router.get("/carts/:cid", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const productId = req.params.cid; // Obtén el id del producto de req.params

  const { status, carrito } = await managerC.cartId(productId);

  if (status == 200) {

    res.status(200).render("cart", { productosCarritos });
  } else if (status == 400) {
    return res.status(400).json({ error: "No se encontro el id" });
  } else {
    return res.status(500).json({ error: "Hubo un error" });
  }
});

router.get("/chat", auth ,async (req, res) => {
  try {
    const usuario = req.session.usuario;
    let messages = await managerChat.loadChat();
 
  
    // Formatear la hora de cada mensaje antes de pasarlos a la plantilla
    messages = formatearHora(messages);
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("chat", { messages, usuario});
  } catch (error) {
    console.error("Error al cargar el chat:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/login", async (req, res) => {
  res.setHeader("Content-Type", "text/html");

  const {user, error} = req.query;
 
  res.status(200).render("login",{user,error, login:false});
});

router.get("/registro", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const {error} = req.query;

  res.status(200).render("register", {error,login:false});
});

router.get("/perfil", auth, async(req,res)=>{
  res.setHeader("Content-Type", "text/html");
  const usuario = req.session.usuario;
  res.status(200).render("perfil", {usuario,login:true});
})
export default router;
