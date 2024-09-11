// Node modules.
import { Request, Response } from 'express';

// Services.
import ServiceWebhook from '../services/webhook';
import Logger from '../helpers/winston-loki';

// Services.
export default class {
	public static async execute(req: Request, res: Response): Promise<void> {
		res.send();
		try {
			const serviceWebhook = new ServiceWebhook(req);

			await serviceWebhook.execute();
		} catch (error) {
			const sentry = res.app.locals.service.sentry;
			sentry.captureException(error);
			Logger.instance.logger.error(error);
			console.error(error);
		}
	}
}
