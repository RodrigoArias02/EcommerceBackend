export class CartSaveProduct {
  constructor(newProduct) {
    this.idProducto = newProduct.newIdProduct;
    this.quantity = newProduct.newQuantity;
  }
}

export class RenderCart {
  constructor(objectAmount,carrito) {
    this.idCarrito=carrito._id
    this.productos=carrito.productos
    this.total=objectAmount.totalPrecios
  }
}

export class CartAmount {
  constructor(cart) {
    this.precios = [];

    cart.productos.forEach((element) => {
      if (element && element.idProducto && element.idProducto.price && element && element.quantity) {
        const precioTotal = element.idProducto.price * element.quantity;

        this.precios.push({
          title: element.idProducto.title,
          precioTotal: precioTotal,
          cantidad: element.quantity,
          precioUnidad: element.idProducto.price,
        });
      }
    });

    this.totalPrecios = this.precios.reduce(
      (total, producto) => total + producto.precioTotal,
      0
    );
  }
}

export class StockAndQuantity {
    constructor(peticion) {
        this.valores = [];
      
        peticion.carrito.productos.forEach((element) => {
            if (element.idProducto && element.idProducto.title) {
                this.valores.push({
                    _id:element.idProducto._id,
                    title: element.idProducto.title,
                    stock: element.idProducto.stock,
                    cantidad: element.quantity,
                });
            }
        });
    }
}
