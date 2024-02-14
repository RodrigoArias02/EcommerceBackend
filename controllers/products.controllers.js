import mongoose from "mongoose";
import { ProductServices } from "../service/product.service.js";
import { ProductRead } from "../DTO/productsDTO.js";
import { validTypeData } from "../utils.js";
import { generarProductos } from "../mock.js";
import { CustomError } from "../utils/customErrors.js";
import { STATUS_CODES, ERRORES_INTERNOS } from "../utils/typesErrors.js";
import { errorArgumentos } from "../utils/errors.js";



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
      productos = await ProductServices.listProductsAggregateService(
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
    const productos = await ProductServices.listProductsService();

    res.setHeader("Content-Type", "text/html");
    res.status(200).render("realTimesProducts", { productos: productos.docs });
  }
  //cargar productos
  static async loadProducts(req, res) {
    res.setHeader("Content-Type", "text/html");
    let pagina = 1;
    const usuario = req.session.usuario;
    const esUsuario = usuario && usuario.rol === "usuario" ? true : false;
    if (req.query.pagina) {
      pagina = req.query.pagina;
    }

    let productos;
    try {
      productos = await ProductServices.listProductsService(pagina);
      
      //usando FAKER ↓↓↓↓↓
      // productos.docs=generarProductos()

    } catch (error) {}
    let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
      productos;
    res.status(200).render("productos", {productos: productos.docs,hasNextPage,hasPrevPage,prevPage,nextPage,totalPages,usuario,esUsuario});
  }

  static async getProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    let resultado = await ProductServices.listProductsService();

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
    // let resultado;
    const idValido = mongoose.Types.ObjectId.isValid(productId);
    if (!idValido) {
      return res.status(400).json({
        error: "El id no cumple las caracteristicas de id tipo mongoDB",
      });
    }
    const { status, producto } = await ProductServices.ProductoIdService(
      productId
    );

    if (status == "200") {
      return res.status(200).json({ producto });
    } else {
      return res.status(400).json({ error: "Producto no encontrado" });
    }
  }

  static async postCreateProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let product = req.body;
    const propiedadesPermitidas = ["title", "description", "code", "price", "status", "stock", "category", "thumbnail"];
    let propiedadesQueLlegan = Object.keys(product);
    let valido = propiedadesQueLlegan.every((propiedad) =>
      propiedadesPermitidas.includes(propiedad)
    );

      if(!valido){
        // return  res.status(400).json({ error: "Campos no validos" });
        throw CustomError.CustomError("Complete name", "Falta completar la propiedad name", STATUS_CODES.ERROR_ARGUMENTOS, ERRORES_INTERNOS.ARGUMENTOS, errorArgumentos(product))
      }

    product= ProductRead(product)
    const OK=validTypeData(product)
   
    if (OK == true) {
      const estado = await ProductServices.ingresarProductosService(product);

      if (estado.status === 201) {
        return res.status(201).json(estado);
      } else {
        return res.status(estado.status).json(estado);
      }
    } else {
      return  res.status(400).json({ error: "el valor de algunos de los campos no es admitido" });
    }
  }

  static async putUpdateProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { pid } = req.params;
    const idValido = mongoose.Types.ObjectId.isValid(pid);
    if (!idValido) {
      return res
        .status(400)
        .json({
          error: "El id no cumple las caracteristicas de id tipo mongoDB",
        });
    }
    const estado = await ProductServices.actualizarProductoService(
      pid,
      req.body
    );
    if (estado == true) {
      return res.status(200).json({ estado });
    } else {
      return res.status(400).json({ estado });
    }
  }

  static async deleteProduct(req, res) {
    try {
      res.setHeader("Content-Type", "application/json");
      let { pid } = req.params;
      const idValido = mongoose.Types.ObjectId.isValid(pid);
      if (!idValido) {
        return res
          .status(400)
          .json({
            error: "El id no cumple las caracteristicas de id tipo mongoDB",
          });
      }
      const resultado = await ProductServices.deleteProductService(pid);

      return res.status(resultado.status).json(resultado);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ha ocurrido un error en el servidor" });
    }
  }


}
