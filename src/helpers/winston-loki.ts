// Node Modules.
import winston from 'winston';
import LokiTransport from 'winston-loki';

// Types.
import * as Winston from 'winston';

// Cache.
import data from '../data/general';

export default class Logger {
	static #instance: Logger;

	public logger!: Winston.Logger;

	private constructor() {
		const username = 'admin';
		const password = 'zhmvRHjdYi2Cs3MYxxiilaCaa28T7B9OrVoJDr';
		const auth = btoa(`${username}:${password}`);
		const projectNamespace = data.cache.get('projectNamespace');
		const host = data.cache.get('host');

		const logger = winston.createLogger({
			level: 'info',
			format: winston.format.json(),
			transports: [
				new LokiTransport({
					host: 'https://loki.qsoft.zone',
					labels: {
						name: projectNamespace,
						app: projectNamespace,
						hostname: host,
					},
					json: true,
					replaceTimestamp: true,
					headers: {
						Authorization: `Basic ${auth}`,
					},
				}),
			],
		});

		this.logger = logger;
	}

	public static get instance(): Logger {
		if (!Logger.#instance) {
			Logger.#instance = new Logger();
		}

		return Logger.#instance;
	}

	public processOn(): void {
		this.logger.info('ZART');
		process.on('unhandledRejection', (reason, promise) => {
			this.logger.error(
				'Unhandled Rejection at:',
				promise,
				'reason:',
				reason,
			);
			// Application specific logging, throwing an error, or other logic here
		});

		process.on('uncaughtException', (err, origin) => {
			this.logger.error('Uncaught Exception:', err, 'origin:', origin);
			// Application specific logging, throwing an error, or other logic here
		});

		process.on('warning', (warning) => {
			this.logger.warn('Warning:', warning);
			// Application specific logging, throwing an error, or other logic here
		});
	}
}
