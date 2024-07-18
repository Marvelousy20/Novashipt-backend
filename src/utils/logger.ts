import { createLogger, format, transports, addColors } from 'winston';
import mongoose from 'mongoose';
import 'winston-mongodb';
import * as dotenv from "dotenv";

dotenv.config();


const options = {
    level: 'error', // default 'info'
    db: process.env.MONGODB_URI as string,
    collection: 'serverLog', // default name
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    metaKey: 'meta', // use metaKey to store metadata
    format: format.combine(
        format.timestamp({
            format: 'DD/MM/YYYY, HH:mm:ss'
        }),
        format.metadata(),
        format.align(),
        format.json()
    )
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

addColors(colors);

const logger = createLogger({
    transports: [
        new transports.MongoDB(options),
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize({ all: true, colors: colors, level: true, message: true }),
                format.timestamp({
                    format: 'DD/MM/YYYY, HH:mm:ss'
                }),
                format.metadata(),
                format.align(),
                format.prettyPrint({
                    colorize: true,
                    depth: 10
                }),
                format.printf(info => `[Nest] ${info.level}  - ${info.timestamp}  ${info.message}${info.metadata.message ? ' - ' + info.metadata.message : ''}${info.metadata.label ? ' - ' + info.metadata.label : ''}`),
            ),
            handleExceptions: true,
        })
    ],
    exitOnError: false
});

export { logger };
