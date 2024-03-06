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

  async searchUseriId(id){
    console.log(id)
    try {
        const existe = await UserModelo.findOne({ _id:id }).lean();
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

  async updateUser(email,user){
    try {
      let result = await UserModelo.updateOne(
        { email },
        {  $set:user }
      );

      // Verificar si se actualizó correctamente
      if (result.modifiedCount === 1) {
        console.log("Documento actualizado con éxito");
        return { status: 200, message: "Documento actualizado con éxito" };
      } else {
        console.log("No se encontró el documento o no hubo cambios");
        return {
          status: 404,
          error: "No se encontró el documento o no hubo cambios",
        };
      }
    } catch (error) {
      console.error("Error al listar productos:", error);
      return null;
    }
  }
}
