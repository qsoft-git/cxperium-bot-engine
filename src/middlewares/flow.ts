// ? Node modules.
import { Request, Response } from 'express';

// ? Services.
import ServiceFlows from '../services/flows/flow';
import Logger from '../helpers/winston-loki';

export default class {
	public static async execute(req: Request, res: Response): Promise<void> {
		try {
			const serviceFlows = new ServiceFlows(req);
			const response = await serviceFlows.execute();
			res.send(response);
		} catch (error) {
			const sentry = res.app.locals.service.sentry;
			sentry.captureException(error);
			Logger.instance.logger.error(error);
			console.error(error);
		}
	}
}
