import UserModelo from "../models/user.model.js";

export class ManagerUsersMongoDB {
  async createUser(usuarios) {
    try {
      let usuario = await UserModelo.create(usuarios);
      return usuario;
    } catch (error) {
      console.error("Error al listar productos:", error);
      return null;
    }
  }
  async searchUserEmail(email){
    try {
        const existe = await UserModelo.findOne({ email }).lean();
        return existe
    } catch (error) {
        return error
    }
  }

  async searchCartUsed(idCart){
    try {
     
      const existe = await UserModelo.findOne({ cartId:idCart }).lean();
  
      return existe
  } catch (error) {
      return error
  }
  }
}
