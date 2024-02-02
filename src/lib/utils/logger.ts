import { info, warn, error, debug } from 'tauri-plugin-log-api';

export const LOG_LEVELS = {
	INFO: 1,
	WARN: 2,
	ERROR: 3,
	DEBUG: 4
};

export class Logger {
	private static instance: Logger | null = null;
	static logLevel: number = 1;

	private constructor() {
		let level = import.meta.env.VITE_LOG_LEVEL ? parseInt(import.meta.env.VITE_LOG_LEVEL) : 4;
		if (import.meta.env.DEV) level = 4;
		if (import.meta.env.PROD) level = 1;
		Logger.logLevel = level;
	}
	public static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}

	static info(message: string) {
		if (this.logLevel >= LOG_LEVELS.INFO) {
			info(message);
		}
	}
	static warn(message: string) {
		if (this.logLevel >= LOG_LEVELS.WARN) {
			warn(message);
		}
	}
	static error(message: string) {
		if (this.logLevel >= LOG_LEVELS.ERROR) {
			error(message);
		}
	}
	static debug(message: string) {
		if (this.logLevel >= LOG_LEVELS.DEBUG) {
			debug(message);
		}
	}
}
