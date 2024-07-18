import {logger} from './logger'

function terminate (server:any, options = { coredump: false, timeout: 1000 }) {
      // Exit function
      const exit = (code: any) => {
            options.coredump ? process.abort() : process.exit(code)
      }

      return (code: any, reason: any) => (err: Error, promise: any) => {
            if (err && err instanceof Error) {
                  // Log error information, using a proper error library(probably winston)
                  logger.error(err.message, [{error: err.stack}])
                  // console.log(err.message, err.stack)
            }

            // Attempt a graceful shutdown
            server.close(exit)
            setTimeout(exit, options.timeout).unref()
      }
}


function errorMessageHandler(error: Error) {
      const message
            = error.name  === "SequelizeError" ? "Unable to handle request, please try again in a few seconds"
            : error.name === "CastError" ? "Unable to handle request, an invalid id is sent"
            : error.message

      return message
}

export {terminate, errorMessageHandler}
