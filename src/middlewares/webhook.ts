// Node modules.
import { Request, Response } from 'express';

// Services.
import ServiceWebhook from '../services/webhook';

// Services.
export default class {
	public static async execute(req: Request, res: Response): Promise<void> {
		res.send();
		try {
			const serviceWebhook = new ServiceWebhook(req);

			await serviceWebhook.execute();
		} catch (error) {
			console.error(error);
		}
	}
}
