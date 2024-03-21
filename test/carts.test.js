import { expect } from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";
import { configVar } from "../config/config.js";
import mongoose from "mongoose";
import { CartAmount } from "../DTO/cartsDTO.js";
try {
  await mongoose.connect(configVar.MONGO_URL, { dbName: configVar.DBNAME });
  console.log("Conexión exitosa a la base de datos");
} catch (error) {
  console.error("Error al conectar a la base de datos:", error);
}

const requester = supertest("http://localhost:3000");

describe("Prueba proyecto ecommerce", async function () {
  this.timeout(10000);

  describe("Prueba modulo carritos", async () => {
    it("La ruta api/carts en su metodo GET deberia devolver un array de carritos", async () => {
      let { status, body, ok } = await requester.get("/api/carts");
      expect(status).to.be.equal(200);
      expect(ok).to.be.true;
      expect(body.carritos).to.exist;
      expect(body.carritos).to.be.an("array");
    });

    it("La ruta api/carts/{Id} en su metodo GET debera devovler un carrito, ademas la clase cartAmount debería devolver un objeto con un array y una clave numerica", async () => {
      const cartId = "65fb537cb0f8d883faf1cb5a";
      let { status, body, ok } = await requester.get(`/api/carts/${cartId}`);
      const cart = body.carrito;

      expect(ok).to.be.true;
      expect(cart).to.be.an("object");
      expect(status).to.be.equal(200);

      let objectAmount = new CartAmount(cart);

      expect(objectAmount).to.be.an("object");
      expect(objectAmount.precios).to.be.an("array");
      expect(objectAmount.totalPrecios).to.be.a("number");
    });

    it("La ruta api/carts en su metodo POST debería enviar un producto en el carrito", async () => {
      const usuario = {
        email: "juan@gmail.com",
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

      const cartId = "65fb537cb0f8d883faf1cb5a";
      const productId = "65e7c3b84c395f23e03ef0f3";

      // Realiza la solicitud POST y envía la sesión en la cabecera de la solicitud
      let resp = await requester
        .post(`/api/carts/${cartId}/product/${productId}`)
        .set("Cookie", cookie); //le mandamos la cookie connect.sid de la session El servidor utiliza el valor de connect.sid para recuperar la información de sesión asociada con ese usuario, como los datos de autenticación
      expect(resp.ok).to.be.true;
      expect(resp.body).to.be.an("object");
      expect(resp.status).to.be.equal(200);
    });

    // Eliminar todas las sesiones después de que se hayan ejecutado todos los tests
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
