// Node modules.
import { Request, Response } from 'express';

// Services.
import ServiceFlows from '../services/flows/flow';

export default class {
	public static async execute(req: Request, res: Response): Promise<void> {
		try {
			const serviceFlows = new ServiceFlows(req);
			const response = await serviceFlows.execute();
			res.send(response);
		} catch (error) {
			console.error(error);
		}
	}
}
