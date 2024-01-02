// Node modules.
import { Request, Response } from 'express';

// Services.
import ServiceRunDialog from '../services/run-dialog';

// Services.
export default class {
	public static async execute(req: Request, res: Response): Promise<void> {
		res.send();
		try {
			const serviceRunDialog = new ServiceRunDialog(req);
			await serviceRunDialog.execute();
		} catch (error) {
			console.error(error);
		}
	}
}
