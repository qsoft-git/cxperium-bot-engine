// Node modules.
import { Request, Response } from 'express';

// Services.
import ServiceFlows from '../services/flows/flow';

export default class {
	public static async execute(req: Request, res: Response): Promise<void> {
		res.send();
		try {
			const serviceFlows = new ServiceFlows(req);

			await serviceFlows.execute();
		} catch (error) {
			console.error(error);
		}
	}
}
