// Node modules.
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { Application } from 'express';

// Interfaces.
import { IUtilsSentry } from '../interfaces/utils/sentry';

// Types.
import { TSrcIndexConfig } from '../types/src-index';

export class UtilSentry implements IUtilsSentry {
	public sentry!: typeof Sentry;

	public initSentryProperties(data: TSrcIndexConfig, app: Application): void {
		this.sentry = Sentry;
		const dsn = data?.sentryDsn;

		if (dsn) {
			this.sentry.init({
				dsn,
				integrations: [
					// enable HTTP calls tracing
					new Sentry.Integrations.Http({ tracing: true }),
					// enable Express.js middleware tracing
					new Sentry.Integrations.Express({ app }),
					new ProfilingIntegration(),
				],
				// Performance Monitoring
				tracesSampleRate: 1.0, //  Capture 100% of the transactions
				// Set sampling rate for profiling - this is relative to tracesSampleRate
				profilesSampleRate: 1.0,
			});
		}
	}

	public processOn(): void {
		process.on('exit', (code) => {
			console.log('Process exit with code:', code);
		});

		process.on('uncaughtException', (error) => {
			this.sentry.captureException(error);
			console.error('Uncaught Exception:', error);
			process.exit(1);
		});

		process.on('unhandledRejection', (reason) => {
			this.sentry.captureException(reason);
			console.error('Unhandled Rejection at:', reason);
			process.exit(1);
		});
	}
}
