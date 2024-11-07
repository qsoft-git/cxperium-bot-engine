// ? Helpers.
import Logger from '../../helpers/winston-loki';

export interface IUtilsLogger {
	logger: Logger;
	exportLogger: () => Logger;
}
