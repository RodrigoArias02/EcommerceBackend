import { expect } from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";
import { configVar } from "../config/config.js";
import mongoose from "mongoose";
import { ProductRead } from "../DTO/productsDTO.js";
import ProductoModelo from "../dao/models/product.modelo.js";

try {
  await mongoose.connect(configVar.MONGO_URL, { dbName: configVar.DBNAME });
  console.log("Conexión exitosa a la base de datos");
} catch (error) {
  console.error("Error al conectar a la base de datos:", error);
}

const requester = supertest("http://localhost:3000");

describe("Prueba proyecto ecommerce", async function () {
  this.timeout(10000);

  describe("Prueba modulo productos", async () => {
    it("La ruta api/products en su metodo GET deberia devolver un array", async () => {
      let { status, body, ok } = await requester.get("/api/products");

      expect(status).to.be.equal(200);
      expect(ok).to.be.true;
      expect(body.elements.docs).to.exist;
      expect(body.elements.docs).to.be.an("array");
    });

    it("La clase ProductRead debería devolver un objeto", async () => {
      const producto = {
        title: "Televisor",
        description: "Televisor plasma 43 pulgadas",
        code: 23,
        price: 1000,
        owner: "Rodrigo@gmail.com",
        status: true,
        stock: 10,
        category: "electronica",
        thumbnail:
          "https://www.google.com/url?sa=i&url=https%3A%2F%2Flistado.mercadolibre.com.ar%2Fsmart-tv-samsung-43&psig=AOvVaw2fd69zh-YXQkEvVASUaFt3&ust=1710457623129000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODWiqmt8oQDFQAAAAAdAAAAABAF",
      };

      const newProduct = new ProductRead(producto);

      // Verificar los tipos de datos
      expect(newProduct).to.be.an("object");
      expect(newProduct.title).to.be.a("string");
      expect(newProduct.description).to.be.a("string");
      expect(newProduct.code).to.be.a("number");
      expect(newProduct.price).to.be.a("number");
      expect(newProduct.owner).to.be.a("string");
      expect(newProduct.status).to.be.a("boolean");
      expect(newProduct.stock).to.be.a("number");
      expect(newProduct.category).to.be.a("string");
      expect(newProduct.thumbnail).to.be.an("array");
      expect(newProduct.thumbnail[0]).to.be.a("string");
    });

    it("La ruta api/products en su metodo POST debería guardar un producto", async () => {
      const producto = {
        title: "Patineta",
        description: "Patineta gamer",
        code: 43445,
        price: 1000,
        owner: "RodrigoPremium@gmail.com",
        status: true,
        stock: 10,
        category: "electronica",
        thumbnail:
          "https://www.google.com/url?sa=i&url=https%3A%2F%2Flistado.mercadolibre.com.ar%2Fsmart-tv-samsung-43&psig=AOvVaw2fd69zh-YXQkEvVASUaFt3&ust=1710457623129000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCODWiqmt8oQDFQAAAAAdAAAAABAF",
      };

      const usuario = {
        email: "RodrigoPremium@gmail.com",
        password: "1234",
      };
      let { header, body, status, ok } = await requester
        .post(`/api/sessions/current`)
        .send(usuario);
      expect(ok).to.be.true;
      expect(body.user).to.be.an("object");
      expect(status).to.be.equal(200);
      const headers = header;
      // Buscamos la cabecera 'set-cookie'
      const setCookieHeader = headers["set-cookie"];
      let cookie;
      if (setCookieHeader) {
        cookie = setCookieHeader[0];
      }

      const respuesta = await requester
        .post("/api/products")
        .send(producto)
        .set("Cookie", cookie);

      console.log(respuesta.body);
      //status 302 ya que si todo sale bien la página es redirigida
      expect(respuesta.status).to.equal(302);

      // Buscar el producto en la base de datos usando MongoDB
      const productoEncontrado = await ProductoModelo.findOne({
        code: producto.code,
      });

      // Verificar si se encontró el producto en la base de datos
      expect(productoEncontrado).to.exist;
      expect(productoEncontrado.title).to.equal(producto.title);

      const resultDelete = await ProductoModelo.deleteOne({
        code: producto.code,
      });
      expect(resultDelete.acknowledged).to.be.true;
    });

    after(async () => {
      try {
        await mongoose.connection.dropCollection("sessions");
        console.log("Todas las sesiones han sido eliminadas");
      } catch (error) {
        console.error("Error al eliminar las sesiones:", error);
      }
    });
  });
});
