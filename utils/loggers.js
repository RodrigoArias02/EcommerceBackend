import winston from 'winston';
import 'colors'; // Importa la librería 'colors'
import { configVar } from '../config/config.js';

// Definir niveles de log con colores
const levels = {
    debug: 'grey',
    http: 'blue',
    info: 'green',
    warning: 'yellow',
    error: 'red',
    fatal: 'red'
};

// Define un color para cada nivel
winston.addColors(levels);

let logger;

// Verificar el entorno
if (configVar.ENTORNO === 'production') {
    // Configuración de Winston para el entorno de producción
    logger = winston.createLogger({
        levels: levels,
        transports: [
            new winston.transports.File({
                filename: 'utils/errors.log',
                level: 'warning',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                ),
            }),
        ],
    });
} else {
    // Configuración de Winston para el entorno de desarrollo
    logger = winston.createLogger({
        levels: levels,
        transports: [
            new winston.transports.Console({
                level: 'warning', // Define el nivel mínimo a mostrar en la consola
                format: winston.format.combine(
                    winston.format.colorize(), // Colorea los mensajes de consola
                    winston.format.simple()
                )
            })
        ]
    });
}

export const middlog = (req, res, next) => {
    req.logger = logger;
    next();
};

