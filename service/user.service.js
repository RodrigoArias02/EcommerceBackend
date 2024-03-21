import { ManagerUsersMongoDB as DAO } from "../dao/classMongo/managerUsersMongo.js";

class UserService {
  constructor(dao) {
    this.dao = new dao();
  }
  async createUserService(usuarios) {
    return await this.dao.createUser(usuarios);
  }
  async getByEmail(email) {
    return await this.dao.searchUserEmail(email);
  }
  async searchUserIdService(id) {
    return await this.dao.searchUseriId(id);
  }
  async searchCartUsedService(cartId) {
    return await this.dao.searchCartUsed(cartId);
  }

  async updateUserService(email, user) {
    return await this.dao.updateUser(email, user);
  }
  async deleteUserService(email) {
   
    let result= await this.dao.deleteUser(email)
    if(result.status==500){
        return {
            status: 500,
            message: "Error interno al intentar eliminar el usuario.",
          };
    }
    // Verificar si se eliminó correctamente
    if (result.deletedCount === 1) {
      return { status: 201, message: "Usuario eliminado con éxito." };
    } else {
      return {
        status: 404,
        message: "No se encontró el usuario con el ID proporcionado.",
      };
    }
  }
}

export const UserServices = new UserService(DAO);
