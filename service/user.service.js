import { ManagerUsersMongoDB as DAO} from "../dao/classMongo/managerUsersMongo.js";

class UserService{
    constructor(dao){
        this.dao=new dao()
    }
    async createUserService(usuarios){
        return await this.dao.createUser(usuarios)
    }
    async getByEmail(email){
        return await this.dao.searchUserEmail(email)
    }
    async searchUserIdService(id){
        return await this.dao.searchUseriId(id)
    }
    async searchCartUsedService(cartId){
        return await this.dao.searchCartUsed(cartId)
    }

    async updateUserService(email,user){
        return await this.dao.updateUser(email,user)
    }


}

export const UserServices=new UserService(DAO)