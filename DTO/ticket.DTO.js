import { generateUniqueCode } from "../utils.js"
export class TicketSave{
    constructor(carrito,email){
        this.code= generateUniqueCode()
        this.amount= this.calculateTotal(carrito.productos)
        this.purchaser=email
    }

    calculateTotal(productos) {
        let precioTotal = 0;
        productos.forEach(element => {
            // Verificar si idProducto es nulo
            if (element.idProducto && typeof element.idProducto === 'object') {
                let total = element.quantity * element.idProducto.price;
                precioTotal += total;
            }
        });
        return precioTotal;
    }
    
}
export class ReadTicket {
    constructor(user,carrito,productosSinStock) {
      this.email=user.email
      this.nombre=user.first_name
      this.apellido=user.last_name
      this.idCarrito=user.cartId
      this.carrito=carrito.precioss
      this.precioTotal=carrito.totalPrecios
      console.log(productosSinStock)
      this.idsProductosSinStock = productosSinStock;

    }
  }