// ? Node Modules.
import winston from 'winston';
import LokiTransport from 'winston-loki';
import * as Winston from 'winston';

// ? Cache.
import data from '../data/general';

// ? Environments.
const { LOKI_USERNAME, LOKI_PASSWORD, LOKI_HOST } = process.env;

export default class Logger {
	static #instance: Logger;

	public logger!: Winston.Logger;

	private constructor() {
		if (!LOKI_USERNAME) {
			console.info(
				'LOKI_USERNAME is not added as an environment. If you wish to use Grafana Logger see .env.sample for required environment variables.',
			);
			return;
		}
		if (!LOKI_PASSWORD) {
			console.info(
				'LOKI_PASSWORD is not added as an environment. If you wish to use Grafana Logger see .env.sample for required environment variables.',
			);
			return;
		}
		if (!LOKI_HOST) {
			console.info(
				'LOKI_HOST is not added as an environment. If you wish to use Grafana Logger see .env.sample for required environment variables.',
			);
			return;
		}

		const auth = btoa(`${LOKI_USERNAME}:${LOKI_PASSWORD}`);
		const projectNamespace = data.cache.get('projectNamespace');
		const hostname = data.cache.get('host');

		const logger = winston.createLogger({
			level: 'info',
			format: winston.format.json(),
			transports: [
				new LokiTransport({
					host: LOKI_HOST,
					labels: {
						name: projectNamespace,
						app: projectNamespace,
						hostname: hostname,
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
			this?.logger?.error('Uncaught Exception:', err, 'origin:', origin);
			// Application specific logging, throwing an error, or other logic here
		});

		process.on('warning', (warning) => {
			this?.logger?.warn('Warning:', warning);
			// Application specific logging, throwing an error, or other logic here
		});
	}
}
