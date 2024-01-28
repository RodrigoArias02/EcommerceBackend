import { ManagerProductsMongoDB } from "../dao/managerProductsMongo.js";
import mongoose from "mongoose";
const manager = new ManagerProductsMongoDB();
export class ProductsControllers {
  static async home(req, res) {
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
          login: req.session.usuario ? true : false,
        });
      } else {
        res.status(500).send("Hubo un error");
      }
    } catch (error) {}
  }

  static async renderCreateProducts(req, res) {
    const productos = await manager.listProducts();
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("realTimesProducts", { productos: productos.docs });
  }

  //cargar productos
  static async loadProducts(req, res) {
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
    let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
      productos;
    res.status(200).render("productos", {
      productos: productos.docs,
      hasNextPage,
      hasPrevPage,
      prevPage,
      nextPage,
      totalPages,
      usuario,
      login: true,
    });
  }

  static async getProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    let resultado = await manager.listProducts();

    // Verificar si resultado.docs es un array antes de usar slice
    if (Array.isArray(resultado.docs) && req.query.limit) {
      resultado.docs = resultado.docs.slice(0, req.query.limit);
    }

    // Envía la respuesta como JSON
    return res.status(200).json(resultado);
  }

  static async getProductId(req, res) {
    const productId = req.params.pid; // Obtén el id del producto de req.params
    res.setHeader("Content-Type", "application/json");
    console.log("hola");
    // let resultado;
    const idValido = mongoose.Types.ObjectId.isValid(productId);
    if (!idValido) {
      return res
        .status(400)
        .json({
          error: "El id no cumple las caracteristicas de id tipo mongoDB",
        });
    }
    const { status, producto } = await manager.ProductoId(productId);

    if (status == "200") {
      return res.status(200).json({ producto });
    } else {
      return res.status(400).json({ error: "Producto no encontrado" });
    }
  }

  static async postCreateProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    const checkTypes = (value, type) => typeof value === type;
    let {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnail,
    } = req.body;
    thumbnail = Array.isArray(thumbnail) ? thumbnail : [];
    let OK =
      checkTypes(title, "string") &&
      checkTypes(description, "string") &&
      checkTypes(code, "number") &&
      checkTypes(price, "number") &&
      checkTypes(status, "boolean") &&
      checkTypes(stock, "number") &&
      checkTypes(category, "string") &&
      Array.isArray(thumbnail);
    if (OK == true) {

      const estado = await manager.ingresarProductos(
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
      );

      if (estado.status === 201) {
        return res.status(201).json(estado);
      } else {
        return res.status(estado.status).json(estado);
      }
    } else {
      return res
        .status(400)
        .json({ error: "el valor de algunos de los campos no es admitido" });
    }
  }

  static async putUpdateProduct(req, res)  {
    res.setHeader("Content-Type", "application/json");
    let {pid}=req.params;
    const idValido = mongoose.Types.ObjectId.isValid(pid)
    if(!idValido){
      return res.status(400).json({error:"El id no cumple las caracteristicas de id tipo mongoDB"})
    }
    const estado = await manager.actualizarProducto(pid,req.body)
    if(estado==true){
      return res.status(200).json({estado});
    }else{
      return res.status(400).json({estado})
    }
  }

  static async deleteProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let { pid } = req.params;
      const idValido = mongoose.Types.ObjectId.isValid(pid)
      if(!idValido){
        return res.status(400).json({error:"El id no cumple las caracteristicas de id tipo mongoDB"})
      }
      const resultado = await manager.deleteProduct(pid)
  
      return res.status(resultado.status).json( resultado );
    } catch (error) {
      return res.status(500).json({ error: "Ha ocurrido un error en el servidor" });
    }
  }
}
