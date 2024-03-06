import mongoose from "mongoose";
import { ProductServices } from "../service/product.service.js";
import { ProductRead } from "../DTO/productsDTO.js";
import { validTypeData, validateProperties } from "../utils.js";
import { generarProductos } from "../mock.js";
import { STATUS_CODES, ERRORES_INTERNOS } from "../utils/typesErrors.js";
import {
  errorArgumentos,
  errorId,
  errorPeticion,
  errorTipoValores,
} from "../utils/errors.js";
import { CustomError } from "../utils/customErrors.js";
import { io } from "../app.js";
import { configVar } from "../config/config.js";
export class ProductsControllers {
  static async home(req, res, next) {
    res.setHeader("Content-Type", "text/html");
    // const productos=productManager.getProduct()

    let categoria;
    let productos;
    let direccion;
    let pagina;
    let login = req.session.usuario ? true : false;
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

      if (productos.status != 200) {
        throw CustomError.createError(
          "Error al realizar la peticion",
          productos.messageError,
          STATUS_CODES.ERROR_PETICION,
          ERRORES_INTERNOS.OTROS,
          errorPeticion(productos)
        );
      }

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
        login,
      });
    } catch (error) {
      next(error);
    }
  }

  static async renderCreateProducts(req, res, next) {
    res.setHeader("Content-Type", "text/html");
    let login = req.session.usuario ? true : false;
    let email = req.session.usuario.email;
    let {error}=req.query
    try {
      const productos = await ProductServices.listProductsService();
      io.emit("productos", productos.elements.docs);

      if (productos.status != 200) {
        throw CustomError.createError(
          "Error al realizar la peticion",
          productos.messageError,
          STATUS_CODES.ERROR_PETICION,
          ERRORES_INTERNOS.OTROS,
          errorPeticion(productos)
        );
      }

      res
        .status(200)
        .render("realTimesProducts", {
          productos: productos.elements.docs,
          login,
          email,
          error,
        });
    } catch (error) {
      next(error);
    }
  }
  //cargar productos
  static async loadProducts(req, res, next) {
    res.setHeader("Content-Type", "text/html");
    let pagina = 1;
    const login = req.session.usuario ? true : false;
    const usuario = req.session.usuario;
    const esUsuario = usuario.rol === "usuario" ? true : false;

    if (req.query.pagina) {
      pagina = req.query.pagina;
    }

    let productos;
    try {
      productos = await ProductServices.listProductsService(pagina);

      if (productos.status != 200) {
        throw CustomError.createError(
          "Error al realizar la peticion",
          productos.messageError,
          STATUS_CODES.ERROR_PETICION,
          ERRORES_INTERNOS.OTROS,
          errorPeticion(productos)
        );
      }
      //usando FAKER ↓↓↓↓↓
      // productos.docs=generarProductos()

      let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } =
        productos.elements;
      res.status(200).render("productos", {
        productos: productos.elements.docs,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage,
        totalPages,
        usuario,
        esUsuario,
        login,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    try {
      let resultado = await ProductServices.listProductsService();

      if (resultado.status != 200) {
        throw CustomError.createError(
          "Error al realizar la peticion",
          resultado.messageError,
          STATUS_CODES.ERROR_PETICION,
          ERRORES_INTERNOS.OTROS,
          errorPeticion(resultado)
        );
      }
      // Verificar si resultado.docs es un array antes de usar slice
      if (Array.isArray(resultado.elements.docs) && req.query.limit) {
        resultado.elements.docs = resultado.elements.docs.slice(
          0,
          req.query.limit
        );
      }

      // Envía la respuesta como JSON
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
    next();
  }

  static async getProductId(req, res, next) {
    const productId = req.params.pid; // Obtén el id del producto de req.params
    res.setHeader("Content-Type", "application/json");
    try {
      const idValido = mongoose.Types.ObjectId.isValid(productId);
      console.log(idValido);
      if (!idValido) {
        throw CustomError.createError(
          "Error en el id",
          "El id no cumple las caracteristicas de id tipo mongoDB",
          STATUS_CODES.ERROR_PETICION,
          ERRORES_INTERNOS.OTROS,
          errorId(idValido, productId)
        );
      }

      const { status, producto } = await ProductServices.ProductoIdService(
        productId
      );

      if (status != "200") {
        return res.status(200).json({ producto });
      } else {
        return res.status(400).json({ error: "Producto no encontrado" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async postCreateProduct(req, res, next) {
    try {
      res.setHeader("Content-Type", "application/json");
      let usuario=req.session.usuario
      let product = req.body;
      console.log(product);
      const valido = validateProperties(product);
      console.log(valido);
      if (!valido) {
        throw CustomError.createError(
          "Error en propiedades",
          "Propiedades inválidas",
          STATUS_CODES.ERROR_ARGUMENTOS, // Cambiar statusCode a 400
          ERRORES_INTERNOS.ARGUMENTOS,
          errorArgumentos(valido, req.body)
        );
      }
      product = new ProductRead(product);
      const OK = validTypeData(product);
      if (OK != null) {
        throw CustomError.createError(
          "Error en tipo de datos",
          "El tipo de datos de algunos de los campos no es admitido",
          STATUS_CODES.ERROR_DATOS_ENVIADOS,
          ERRORES_INTERNOS.ARGUMENTOS,
          errorTipoValores(OK)
        );
      }
      console.log(usuario.rol)
      if(usuario.rol != "premium" && usuario.rol != "admin"){
        return res.status(403).json({error: "Permisos insuficientes para subir un producto."})
    }
    
      
      const estado = await ProductServices.ingresarProductosService(product);

      if (estado.status != 201) {
        throw CustomError.createError(
          "Error al realizar la peticion",
          estado.messageError,
          STATUS_CODES.ERROR_PETICION,
          ERRORES_INTERNOS.OTROS,
          errorPeticion(estado)
        );
      }
      return res.redirect(`${configVar.URL}/ingresarProductos`);
    } catch (error) {
      // Pasar el error al siguiente middleware (errorHandler)
      next(error);
    }
    next();
  }

  static async putUpdateProduct(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    let { pid } = req.params;
    try {
      const idValido = mongoose.Types.ObjectId.isValid(pid);
      if (!idValido) {
        throw CustomError.createError(
          "Error en el id",
          "El id no cumple las caracteristicas de id tipo mongoDB",
          STATUS_CODES.ERROR_PETICION,
          ERRORES_INTERNOS.OTROS,
          errorId(idValido, pid)
        );
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
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      res.setHeader("Content-Type", "application/json");
      const usuario = req.session.usuario;
      let { pid } = req.params;
      console.log(pid)
      const idValido = mongoose.Types.ObjectId.isValid(pid);
      if (!idValido) {
        throw CustomError.createError(
          "Error en el id",
          "El id no cumple las caracteristicas de id tipo mongoDB",
          STATUS_CODES.ERROR_PETICION,
          ERRORES_INTERNOS.OTROS,
          errorId(idValido, pid)
        );
      }
      const { producto } = await ProductServices.ProductoIdService(pid);
        if (usuario.rol=="premium" && producto.owner != usuario.email) {
          return res.status(403).json({status:403,error:"permisos insuficientes", ruta:configVar.URL} );   
        }
  
      const resultado = await ProductServices.deleteProductService(pid);

      const productos = await ProductServices.listProductsService();
      //emitimos el array sin el producto eliminado
      io.emit("eliminado", productos.elements.docs);
      return res.status(resultado.status).json(resultado);
    } catch (error) {
      next(error);
    }
  }
}
