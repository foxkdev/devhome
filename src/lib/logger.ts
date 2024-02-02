const LOG_LEVELS = {
	INFO: 1,
	WARN: 2,
	ERROR: 3,
	DEBUG: 4
};

export class Logger {
	logLevel: number = 1;

	constructor() {}

	log(message: string) {
		if (this.logLevel == LOG_LEVELS.DEBUG) {
			console.log(message);
		}
	}
	info(message: string) {
		if (LOG_LEVELS.INFO >= this.logLevel) {
			console.info(message);
		}
	}
	warn(message: string) {
		if (LOG_LEVELS.WARN >= this.logLevel) {
			console.warn(message);
		}
	}
	error(message: string) {
		if (LOG_LEVELS.ERROR >= this.logLevel) {
			console.error(message);
		}
	}
	debug(message: string) {
		if (LOG_LEVELS.DEBUG >= this.logLevel) {
			console.debug(message);
		}
	}
}
