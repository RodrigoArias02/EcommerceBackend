import carritoModelo from "../models/carts.model.js";

export class ManagerCartMongoDB {
  async listCart() {
    try {
      let carritos = await carritoModelo.find();
      return carritos;
    } catch (error) {
      console.error("Error al listar productos:", error);
      return { status: 500, error: "Error al buscar carritos" };
    }
  }

  async createCart() {
    try {
      let nuevoCarrito = await carritoModelo.create({});
      return nuevoCarrito
    } catch (error) {
      console.error("Error al añadir el producto:", error);
      return { status: 500, error: "Error al añadir el producto a la BD" };
    }
  }

  async cartId(id) {
    try {
    const cartSearch = await carritoModelo.findOne({ _id: id }).populate("productos.idProducto");
    return cartSearch
    } catch (error) {
      console.error("Algo salio mal en la busqueda:", error);
      return { status: 500, error: "Algo salio mal en la busqueda" };
    }
  }

  async addProductToCart(idCart, nuevasPropiedades) {

    try {
      let carrito = await this.cartId(idCart);
      let productosNuevos = carrito.productos;
        let result = await carritoModelo.findOne({
          _id: idCart,
          productos: { $elemMatch: { idProducto: nuevasPropiedades.idProducto } },
        });
  
        //si encuentra producto
        if (result) {
          const indice = result.productos.findIndex(objeto => objeto.idProducto.toString() === nuevasPropiedades.idProducto.toString());

          // Si el id se repite, aumentar quantity
          if (indice !== -1) {
            result.productos[indice].quantity++;
          }
        
          productosNuevos=result.productos
          console.log("Producot ya ingresado, se agrego +1")
        }else{
          //Si el array productos tiene mas longitud a 0 le agregamos el nuevo producto, sino le redefinimos las nuevas
          if (carrito.productos.length > 0) {
            productosNuevos.push(nuevasPropiedades);
          } else {
            productosNuevos = nuevasPropiedades;
          }
        }

      result = await carritoModelo.updateOne(
        { _id: idCart },
        { productos: productosNuevos }
      );

      return result
    } catch (error) {
      console.error("Errror al actualizar el documento:", error);
      return {
        status: 500,
        error: `Error al actualizar el documento: ${error}`,
      };
    }
  }

  async updateQuantity(idCart, idProduct, quantity) {
    try {
      const quantityUpdateResult = await carritoModelo.updateOne(
        { _id: idCart, "productos.idProducto": idProduct },
        { $set: { "productos.$.quantity": quantity.quantity } }
      );
      return quantityUpdateResult
    } catch (error) {
      return { status: 500, error: `Hubo un error: ${error}` };
    }
  }

  async updateProducts(cartId, arrayProducts) {
    try {
      const updateResult = await carritoModelo.updateOne(
        { _id: cartId },
        { $set: { productos: arrayProducts } }
      );
      return updateResult
    } catch (error) {
      return { status: 500, error: `Hubo un error: ${error}` };
    }
  }
  
  async deleteProductCart(idCarrito, idProductoAEliminar) {
    try {
      // Actualizamos el carrito usando $pull
      const deleteResult = await carritoModelo.updateOne(
        { _id: idCarrito },
        { $pull: { productos: { idProducto: idProductoAEliminar } } }
      );
      return deleteResult
    } catch (error) {
      return { status: 500, error: `Hubo un error: ${error}` };
    }
  }

  async deleteTotalProductCart(id) {
    try {
      const result = await carritoModelo.updateOne(
        { _id: id },
        { productos: [] }
      );
      return result
    } catch (error) {
      return { status: 500, error: `Hubo un error: ${error}` };
    }
  }

  async deleteCart(id) {
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
