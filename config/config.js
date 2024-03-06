import dotenv from 'dotenv'
import __dirname from '../utils.js';
import { join } from 'path'; // Importa la función join del módulo path

const rutaConfig = join(__dirname,'.env');

dotenv.config(
    {
        path: rutaConfig
    }
);

export const configVar={
    PORT:process.env.PORT,
    MONGO_URL:process.env.MONGO_URL,
    DBNAME: process.env.DBNAME,
    SECRETSESSION:process.env.SECRETSESSION,
    CLIENTSECRETGITHUB:process.env.CLIENTSECRETGITHUB,
    CLIENTIDGITHUB:process.env.CLIENTIDGITHUB,
    ENTORNO:process.env.ENTORNO,
    URL:process.env.URL
}