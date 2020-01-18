const { createLogger, format, transports } = require('winston');
const logLevel = process.env.LOG_LEVEL;
const logger = createLogger({
	level: logLevel,
	format: format.combine(
		format.colorize(),
		format.timestamp({
			format: 'DD-MM-YYYY HH:mm:ss',
		}),
		format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
	),
	transports: [new transports.Console()],
});
module.exports = logger;
