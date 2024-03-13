import mongoose from "mongoose";
import { ProductServices } from "../service/product.service.js";
import { CartServices } from "../service/cart.service.js";
import { CartAmount, CartSaveProduct, RenderCart } from "../DTO/cartsDTO.js";
import { TicketServices } from "../service/ticket.service.js";

export class CartsControllers {

  static async renderCart(req, res) {
    res.setHeader("Content-Type", "text/html");
    const productId = req.params.cid; // Obtén el id del producto de req.params
    const login=req.session.usuario ? true : false
    const { status, carrito } = await CartServices.searchCartIdService(productId);

    let objectAmount=new CartAmount(carrito)

    let render=new RenderCart(objectAmount,carrito)

    if (status == 200) {
      res.status(200).render("cart", {render,login});
    } else if (status == 400) {
      return res.status(400).json({ error: "No se encontro el id" });
    } else {
      return res.status(500).json({ error: "Hubo un error" });
    }
  }

  static async loadCarts(req, res) {
    res.setHeader("Content-Type", "application/json");
    const carritos = await CartServices.listCartService();
    if(carritos.status){
      return res.status(carritos.status).json( carritos );
    }
    return res.status(200).json({ carritos });
  }

  static async postCreateCart(req, res) {
    res.setHeader("Content-Type", "application/json");

    // const validacion = cartManager.CreateCart();
    const validacion = await CartServices.createCartService();
    if (validacion.status==201) {
      return res.status(201).json("Carrito creado con exito");
    } else {
      return res.status(validacion.status).json(validacion.error);
    }
  }

  static async GetCartId(req, res) {
    const productId = req.params.cid; // Obtén el id del producto de req.params
    res.setHeader("Content-Type", "application/json");

    const carrito = await CartServices.searchCartIdService(productId);
    if (carrito.status == 200) {
      return res.status(200).json({ carrito });
    } else {
      return res.status(carrito.status).json(carrito.error);
    } 
  }

  static async postAddProductToCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    const usuario=req.session.usuario
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
    const validacion = await ProductServices.ProductoIdService(productId);
    if (validacion.status != 200) {
      return res.status(400).json(validacion.error);
    }
    if(validacion.producto.owner==usuario.email){
      return res.status(400).json({error:"No puedes añadir a tu carrito un producto que tu creaste...!!!"});
    }

    let formProduct = {
      idProducto: validacion.producto._id,
      quantity: 1,
    };

    const agregarProducto = await CartServices.addProductToCartService(cartId, formProduct);
    return res.status(200).json(agregarProducto);
  }

  static async putUpdateQuantity(req, res) {
    res.setHeader("Content-Type", "application/json");
    const productId = req.params.pid; // Obtén el id del producto de req.params
    const cartId = req.params.cid; // Obtén el id del producto de req.params
    const quantity = req.body;

    if (typeof quantity === "object" && quantity !== null) {
      const updateQuantity = await CartServices.updateQuantityService(
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
    const newProduct = req.body;

    if (!('newIdProduct' in newProduct) || !('newQuantity' in newProduct)) {
      return res.status(400).json({ error: 'Los datos del nuevo producto son inválidos' });
  }

    let arrayProducts=new CartSaveProduct(newProduct)
    arrayProducts=[arrayProducts]
  
    const idValido = mongoose.Types.ObjectId.isValid(cartId)
    if(!idValido){
      return res.status(400).json({error:"El id no cumple las caracteristicas de id tipo mongoDB"})
    }
    const checkCart = await CartServices.searchCartIdService(cartId);
    if (checkCart.status != 200) {
     
      return res.status(checkCart.status).json({ checkCart });
    } else {
      if (Array.isArray(arrayProducts)) {
        const updateProducts = await CartServices.updateProductsService(
          cartId,
          arrayProducts
        );

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
  
    const deletProducts = await CartServices.deleteTotalProductCartService(cartId);
    return res.status(deletProducts.status).json(deletProducts);
  }

  static async deleteOneProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    const cartId = req.params.cid; // Obtén el id del producto de req.params
    const productId = req.params.pid; // Obtén el id del producto de req.params
  
    const deletProducts = await CartServices.deleteProductCartService(cartId, productId);
    if(deletProducts.status){
      return res.status(deletProducts.status).json(deletProducts);
    }
    return res.status(200).json(deletProducts);
  }

  static async purchase(req, res) {
    res.setHeader("Content-Type", "application/json");
    const cartId = req.params.cid; // Obtén el id del producto de req.params

    let ticket= await TicketServices.createTicketService(cartId)
    if(ticket.status){
      return res.status(ticket.status).json(ticket);
    }
    return res.status(200).json({ticket});
  }
}
