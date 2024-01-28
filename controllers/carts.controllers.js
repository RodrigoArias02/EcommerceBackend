import { ManagerCartMongoDB } from "../dao/managerCartsMongo.js";
import mongoose from "mongoose";
import { ManagerProductsMongoDB } from "../dao/managerProductsMongo.js";

const manager = new ManagerCartMongoDB();
const managerProduct=new ManagerProductsMongoDB

export class CartsControllers {

  static async renderCart(req, res) {
    res.setHeader("Content-Type", "text/html");
    const productId = req.params.cid; // Obtén el id del producto de req.params

    const { status, carrito } = await manager.cartId(productId);
    const productos=carrito.productos
    console.log(productos)
    if (status == 200) {
      res.status(200).render("cart", { productos });
    } else if (status == 400) {
      return res.status(400).json({ error: "No se encontro el id" });
    } else {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async loadCarts(req, res) {
    res.setHeader("Content-Type", "application/json");
    const carritos = await manager.listCart();
    return res.status(201).json({ carritos });
  }

  static async postCreateCart(req, res) {
    res.setHeader("Content-Type", "application/json");

    // const validacion = cartManager.CreateCart();
    const validacion = manager.createCart();
    if (validacion) {
      return res.status(201).json("Carrito creado con exito");
    } else {
      return res.status(400).json("No se pudo crear el carrito");
    }
  }

  static async GetCartId(req, res) {
    const productId = req.params.cid; // Obtén el id del producto de req.params
    res.setHeader("Content-Type", "application/json");

    const { status, carrito } = await manager.cartId(productId);
    if (status == 200) {
      return res.status(200).json({ carrito });
    } else if (status == 400) {
      return res.status(400).json({ error: "No se encontro el id" });
    } else {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async postAddProductToCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    const productId = req.params.pid; // Obtén el id del producto de req.params
    const cartId = req.params.cid; // Obtén el id del producto de req.params
    const idValido = mongoose.Types.ObjectId.isValid(cartId);
    if (!idValido) {
      return res
        .status(400)
        .json({
          error: "El id no cumple las caracteristicas de id tipo mongoDB",
        });
    }
    const validacion = await managerProduct.ProductoId(productId);
    if (validacion.status != 200) {
      return res.status(400).json(validacion.error);
    }
    let formProduct = {
      idProducto: validacion.producto._id,
      quantity: 1,
    };

    const agregarProducto = await manager.addProductToCart(cartId, formProduct);
    return res.status(200).json(agregarProducto);
  }

  static async putUpdateQuantity(req, res) {
    res.setHeader("Content-Type", "application/json");
    const productId = req.params.pid; // Obtén el id del producto de req.params
    const cartId = req.params.cid; // Obtén el id del producto de req.params
    const quantity = req.body;

    if (typeof quantity === "object" && quantity !== null) {
      const updateQuantity = await manager.updateQuantity(
        cartId,
        productId,
        quantity
      );
      if (updateQuantity.status == 200) {
        return res
          .status(200)
          .json({ status: 200, message: "Cantidad actualizada con exito" });
      } else {
        return res
          .status(updateQuantity.status)
          .json({
            status: updateQuantity.status,
            message: updateQuantity.error,
          });
      }
    } else {
      return res
        .status(200)
        .json({ status: 400, error: "La cantidad no es tipo Object" });
    }
  }

  static async putUpdateProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    const cartId = req.params.cid;
    const arrayProducts = req.body;
  
    const idValido = mongoose.Types.ObjectId.isValid(cartId)
    if(!idValido){
      return res.status(400).json({error:"El id no cumple las caracteristicas de id tipo mongoDB"})
    }
    const checkCart = await manager.cartId(cartId);
    if (checkCart.status != 200) {
     
      return res.status(checkCart.status).json({ checkCart });
    } else {
      if (Array.isArray(arrayProducts)) {
        const updateProducts = await manager.updateProducts(
          cartId,
          arrayProducts
        );
        console.log(updateProducts);
        if (updateProducts.status == 200) {
          return res.status(200).json({ updateProducts });
        } else {
          return res.status(updateProducts.status).json(updateProducts);
        }
      } else {
        return res
          .status(400)
          .json({ status: 400, error: "La cantidad no es tipo Object" });
      }
    }
  }

  static async deleteTotalProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    const cartId = req.params.cid; // Obtén el id del producto de req.params
  
    const deletProducts = await manager.deleteTotalProductCart(cartId);
    return res.status(200).json(deletProducts);
  }

  static async deleteOneProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    const cartId = req.params.cid; // Obtén el id del producto de req.params
    const productId = req.params.pid; // Obtén el id del producto de req.params
  
    const deletProducts = await manager.deleteProductCart(cartId, productId);
    return res.status(200).json(deletProducts);
  }
}
