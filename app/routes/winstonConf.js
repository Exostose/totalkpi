var winston = require('winston');
winston.emitErrs = true;
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
	  handleExceptions: true,
	  humanReadableUnhandledException: true,
	  colorize: true
	}),
    new (winston.transports.File)({
      name: 'debug-file',
      filename: 'filelog-debug.log',
	  handleExceptions: true,
	  humanReadableUnhandledException: true,
	  json: false,
	  maxsize: 104857600, // 5MB = 5242880 	100MB = 104857600
	  maxFiles: 5,
      level: 'debug'
    })
    // new (winston.transports.File)({
      // name: 'error-file',
      // filename: 'filelog-error.log',
	  // json: false,
	  // maxsize: 5242880, //5MB
	  // maxFiles: 5,
      // level: 'error'
    // }),
	// new (winston.transports.File)({
      // name: 'exception-file',
      // filename: 'filelog-exception.log',
      // handleExceptions: true,
	  // json: false,
	  // maxsize: 5242880, //5MB
	  // maxFiles: 5,
      // humanReadableUnhandledException: true
    // })
  ]
});
logger.exitOnError = false;

module.exports = logger;

module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};