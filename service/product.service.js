import { ManagerProductsMongoDB as DAO } from "../dao/classMongo/managerProductsMongo.js";

class ProductService {
  constructor(dao) {
    this.dao = new dao();
  }
  async listProductsService(pagina) {
    return await this.dao.listProducts(pagina);
  }
  async listProductsAggregateService(category, page, direccion) {
    return await this.dao.listProductsAggregate(category, page, direccion);
  }
  async ingresarProductosService(product) {
    let nuevoProducto = await this.dao.ingresarProductos(product);
    return {
      status: 201,
      message: "peticion realizada con exito",
      producto: nuevoProducto,
    };
  }

  async listProductsAggregateService(category, page, direccion) {
    return await this.dao.listProductsAggregate(category, page, direccion);
  }
  async ProductoIdService(id) {
    return await this.dao.ProductoId(id);
  }
  async actualizarProductoService(id, nuevasPropiedades) {
    return await this.dao.actualizarProducto(id, nuevasPropiedades);
  }

  async deleteProductService(id) {
    return await this.dao.deleteProduct(id);
  }
}

export const ProductServices = new ProductService(DAO);
