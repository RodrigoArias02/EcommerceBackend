import { ManagerCartMongoDB as DAO } from "../dao/classMongo/managerCartsMongo.js"

class CartService{
    constructor(dao){
        this.dao=new dao()
    }
    async listCartService(){
        return await this.dao.listCart()
    }
    async createCartService(){
        return await this.dao.createCart()
    }
    async searchCartIdService(cartId){
        return await this.dao.cartId(cartId)
    }
    async addProductToCartService(idCart, nuevasPropiedades){
        return await this.dao.addProductToCart(idCart, nuevasPropiedades)
    }
    async updateQuantityService(idCart, idProduct, quantity){
        return await this.dao.updateQuantity(idCart, idProduct, quantity)
    }
    async updateProductsService(cartId, arrayProducts){
        return await this.dao.updateProducts(cartId, arrayProducts)
    }
    async deleteProductCartService(idCarrito, idProductoAEliminar){
        return await this.dao.deleteProductCart(idCarrito, idProductoAEliminar)
    }
    async deleteTotalProductCartService(id){
        return await this.dao.deleteTotalProductCart(id)
    }
    async deleteCartService(id){
        return await this.dao.deleteCart(id)
    }

}

export const CartServices=new CartService(DAO)