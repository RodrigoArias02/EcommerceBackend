import { ManagerChatMongoDB as DAO } from "../dao/classMongo/managerChatMongo.js"
class ChatService{
    constructor(dao){
        this.dao=new dao()
    }
    async loadChatService(){
        return await this.dao.loadChat()
    }
    async saveMessagesService(user,message){
        return await this.dao.saveMessages(user,message)
    }



}

export const ChatServices=new ChatService(DAO)