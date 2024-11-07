// ? Interfaces.
import { IUtilsLogger } from '../interfaces/utils/logger';

// ? Services.
import Logger from '../helpers/winston-loki';

export class UtilLogger implements IUtilsLogger {
	logger!: Logger;

	exportLogger(): Logger {
		this.logger = Logger.instance;

		return this.logger;
	}
}
