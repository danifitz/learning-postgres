const winston = require('winston')

const service_name = 'learnpostgres-' + process.env.NODE_ENV

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service_name: service_name },
    transports: [
        // - Write all logs to console
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

logger.log({
    level: 'info',
    message: `Winston logging configured for ${service_name}`
})

// Middleware to log incoming HTTP requests
const httpLogger = (req, _res, next) => {
    let date = new Date(Date.now())
    let timestamp = date.toLocaleString('en-GB')

    // log key details about the incoming request
    logger.log({
        level: 'info',
        timestamp: timestamp,
        ipAddress: req.ip,
        httpVersion: req.httpVersion,
        httpMethod: req.method,
        httpPath: req.path
    })
    // call the next bit of middleware
    next()
}

const apiKeyValidation = (req, res, next) => {
    let date = new Date(Date.now())
    let timestamp = date.toLocaleString('en-GB')
    let message = ''

    if (process.env.NODE_ENV === 'development') {
        message = 'NODE_ENV=development - not validating api key'
        next()
    } else {
        const apiKey = req.headers['X-Api-Key']

        if (apiKey === undefined || apiKey.length < 0) {
            // api key is missing
            message = 'Request was missing API key'
            res.status(401).json({ message: "Please include your API key with every request using the 'X-Api-Key' HTTP header" }).end()
        } else {
            // validate key
            message = `Validated request with API key: ${apiKey}`
            next()
        }
    }
    logger.log({
        level: 'info',
        message: message
    })
}

module.exports = { httpLogger, logger, apiKeyValidation };