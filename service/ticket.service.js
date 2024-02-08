import { CartAmount, StockAndQuantity } from "../DTO/cartsDTO.js"
import { ReadTicket, TicketSave } from "../DTO/ticket.DTO.js"
import { ManagerTicketMongoDB as DAO} from "../dao/classMongo/managerTicketMongo.js"
import { CartServices } from "./cart.service.js"
import { ProductServices } from "./product.service.js"
import { UserServices } from "./user.service.js"
class TicketService{
    constructor(dao){
        this.dao=new dao()
    }
    async createTicketService(carritoId){
        const { productosSinStock, nuevasQuantity } = await this.checkStock(carritoId);
        let check=productosSinStock
        const {carrito} = check.length > 0 ? await this.DeleteProduct(carritoId,check): await CartServices.searchCartIdService(carritoId);
        console.log(carrito)
        let user = await UserServices.searchCartUsedService(carritoId)
      
        let TicketCreate= new TicketSave(carrito,user.email)
        await this.dao.create(TicketCreate)
      
        let newcarrito=new CartAmount(carrito)
      
        for (const element of nuevasQuantity) {
            await ProductServices.actualizarProductoService(element._id, {stock:element.stock});
        }
        let generateTicket=new ReadTicket(user,newcarrito,productosSinStock)
        await CartServices.deleteTotalProductCartService(carritoId)
        for (const IdProducto of productosSinStock) {
            console.log("_____")
            console.log(IdProducto)
            console.log("_____")
            await CartServices.addProductToCartService(carritoId,IdProducto)
        }
      
        return generateTicket
    }

    async checkStock(carritoId){
        let cart= await CartServices.searchCartIdService(carritoId)
     
        let {valores}=new StockAndQuantity(cart)


        const productosSinStock = [];

        let nuevasQuantity=[]
        // Función que verifica si el stock es suficiente para la cantidad y registra el id si no lo es
        const stockSuficiente = valores.some(item => {
            if (item.stock < item.cantidad) {
                productosSinStock.push({idProducto:item._id, quantity:item.cantidad});

                return true; // Indica que hay al menos un producto sin stock suficiente
            }else{
                nuevasQuantity.push({
                    _id:item._id,
                    stock:item.stock-item.cantidad
                })
            }
        });

        if (stockSuficiente) {
            console.log('No hay suficiente stock para algunos productos.');
        } else {
            console.log('El stock es suficiente para todos los productos.');
        }

        return { productosSinStock, nuevasQuantity };
    }

    async DeleteProduct(idCart, productosSinStock) {
        for (const IdProducto of productosSinStock) {
            console.log(IdProducto)
            await CartServices.deleteProductCartService(idCart, IdProducto.idProducto);
            console.log("BORRAMOS ELEMENTOS")
        }
    
        return await CartServices.searchCartIdService(idCart);
    }
    


}

export const TicketServices=new TicketService(DAO)