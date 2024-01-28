import UserModelo from "./models/user.model.js";

export class ManagerUsersMongoDB {
  async createUser(first_name,last_name,username,age,passwordHash,cartId,rol) {
    try {
      let usuario = await UserModelo.create({
        first_name,
        last_name,
        email: username,
        age,
        password: passwordHash,
        cartId,
        rol,
      });
      return usuario;
    } catch (error) {
      console.error("Error al listar productos:", error);
      return null;
    }
  }
  async createUserGithub(user) {
    try {
      let usuario = await UserModelo.create({user});
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
}
