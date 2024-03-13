import TicketModelo from "../models/ticket.js";
export class ManagerTicketMongoDB {
    async create(ticket) {
        try {
            let nuevoTicket = TicketModelo.create(ticket);
            return nuevoTicket
        } catch (error) {
            return {
                status: 500,
                error: `Error al actualizar el documento: ${error}`,
              };
        }
    }


}