import UsuariosModelo from "./models/usuario.modelo.js";
import crypto from "crypto";
export class ManagerUsuarioMongoDB {
  async listUser() {
    try {
      let usuario = await ProductoModelo.find();
      return usuario;
    } catch (error) {
      console.error("Error al listar de usuarios:", error);
      return null;
    }
  }

  async aggregateUsers(nombre, email, contra) {
    try {
      let password = crypto
        .createHmac("sha256", "1234")
        .update(contra)
        .digest("hex");
      const usuario = await UsuariosModelo.create({ nombre, email, password });
      return { status: 201, user:usuario };
    } catch (error) {
      return { status: 400, error: "hubo un error al guardar el usuario" };
    }
  }

  async userEmail(email) {
    try {
        const existe= await UsuariosModelo.findOne({email})
        return {status:200, user:existe}
    } catch (error) {
        return {status:400, error:`error al buscar el usuario ${error}`}
    }
  }

  async logIn(email, contra) {
    try {
        let user
        let password = crypto.createHmac("sha256", "1234").update(contra).digest("hex");
        let passwordAdmin = crypto.createHmac("sha256", "1234").update("adminCod3r123").digest("hex");
        const existe= await UsuariosModelo.findOne({email,password}).lean()
        if(!existe){
          return {status:401, error:"No coincide las credenciales"}
        }
        if(existe.email=="adminCoder@coder.com" && password==passwordAdmin){
          user={...existe,
            rol:"admin"
          }
        }else{
          user={...existe,
            rol:"usuario"
          }
        }
        console.log(user)
        return {status:200, user}
    } catch (error) {
        return {status:500, error:`error al ingresar al usuario ${error}`}
    }
  }


  async deletProduct(id) {}
}
