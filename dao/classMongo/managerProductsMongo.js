import { validateProperties } from "../../utils.js";
import ProductoModelo from "../models/product.modelo.js";

export class ManagerProductsMongoDB {
  async listProducts(pagina) {
   
    try {
      
      let prodPaginate = await ProductoModelo.paginate(
        {},
        { lean: true, limit: 3, page: pagina }
      );
      return {status:200, elements:prodPaginate };
    } catch (error) {
      const errores={
        status:500,
        messageError:"Error al listar productos:",
        error:error
      }
      return errores;
    }
  }

  async listProductsAggregate(category, page, direccion) {
    let PAGE_SIZE = 3;
    let aggregatePipeline = [];
    page = parseInt(page);
    try {
      // Agregar etapa de filtración por categoría solo si se proporciona una categoría
      if (category) {
        aggregatePipeline.push({
          $match: { category: { $in: [category] } },
        });
      } else {
        // Agregar una etapa de coincidencia que seleccionará todos los documentos si no hay categoría
        aggregatePipeline.push({
          $match: {},
        });
      }
      aggregatePipeline.push(
        {
          $skip: (page - 1) * PAGE_SIZE,
        },
        {
          $limit: PAGE_SIZE,
        }
      );
      
      // Agregar etapa de ordenación por precio (ascendente o descendente)
      aggregatePipeline.push({
        $sort: { price: direccion === "asc" ? 1 : -1 },
      });

      // Consulta para obtener productos
      let prodCat = await ProductoModelo.aggregate(aggregatePipeline);

      // Consulta para obtener el total de productos
      const totalProducts = await (category
        ? ProductoModelo.countDocuments({ category: { $in: [category] } })
        : ProductoModelo.countDocuments());

      // Calcular información de paginación
      const totalPages = Math.ceil(totalProducts / PAGE_SIZE);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;

      const propiedades = {
        status: 200,
        playload: prodCat,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      };

      return propiedades;
    } catch (error) {
      const propiedades = {
        status:500,
        messageError:"Error al intentar listar los productos",
        error:error
      }
      return propiedades
    }
  }

  async ingresarProductos(product) {
    
    try {
      const existe = await ProductoModelo.findOne({ code:product.code }).lean();
      if (existe != null) {
        return {
          status: 400,
          messageError: `Ya hay un producto registrado con ese codigo: ${product.code}`,
          error:"Ah ingresado un codigo ya registrado."
        };
      }
      let nuevoProducto = ProductoModelo.create(product);
      return nuevoProducto
    } catch (error) {
      console.error("Error al añadir el producto:", error);
      return { status: 400, messageError: "Error al añadir el producto a la BD",error:error };
    }
  }
  async ProductoId(id) {
    try {
      let object
      const productoEncontrado = await ProductoModelo.findOne({
        _id: id,
      }).lean();
      if(productoEncontrado==null){
        object={
          status: 404, producto: productoEncontrado
        }
      }else{
        object={
          status: 200, producto: productoEncontrado
        }
      }
      return object;
    } catch (error) {
      console.error("Algo salio mal en la busqueda:", error);
      return { status: 400, error: "Algo salio mal en la busqueda" };
    }
  }

  async actualizarProducto(id, nuevasPropiedades) {
    try {
      // Actualizar un documento
      const result = await ProductoModelo.updateOne(
        { _id: id },
        { $set: nuevasPropiedades }
      );

      // Verificar si se actualizó correctamente
      if (result.modifiedCount === 1) {
        console.log("Documento actualizado con éxito");
        return { status: 200, message: "Documento actualizado con éxito" };
      } else {
        console.log("No se encontró el documento o no hubo cambios");
        return {
          status: 404,
          error: "No se encontró el documento o no hubo cambios",
        };
      }
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
      return {
        status: 500,
        error: `Error al actualizar el documento: ${error}`,
      };
    }
  }

  async deleteProduct(id) {
    try {
      // Validar si el ID proporcionado es válido

      if (!id) {
        return {
          status: 400,
          message: "Se requiere un ID válido para eliminar el producto.",
        };
      }

      // Intentar eliminar el documento
      const result = await ProductoModelo.deleteOne({ _id: id });

      // Verificar si se eliminó correctamente
      if (result.deletedCount === 1) {
       
        return { status: 201, message: "Producto eliminado con éxito." };
      } else {
        return {
          status: 404,
          message: "No se encontró el producto con el ID proporcionado.",
        };
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return {
        status: 500,
        message: "Error interno al intentar eliminar el producto.",
      };
    }
  }
}
