import TicketModelo from "../models/ticket.js";
export class ManagerTicketMongoDB {
    async create(ticket) {
        try {
            let nuevoTicket = TicketModelo.create(ticket);
            return nuevoTicket
        } catch (error) {
            console.error("Error al listar productos:", error);
            return null
        }
    }


}