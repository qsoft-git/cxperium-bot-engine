// ? Node modules.
import { Request, Response } from 'express';

// ? Services.
import ServiceWhatsappRunDialog from '../services/whatsapp/run-dialog';

// ? Helpers.
import Logger from '../helpers/winston-loki';

export default class {
	static async executeWhatsapp(req: Request, res: Response): Promise<void> {
		res.send();

		const body = req.body;

		if (!body?.contacts || !body?.messages) return;

		try {
			const serviceRunDialog = new ServiceWhatsappRunDialog(req);
			await serviceRunDialog.execute();
		} catch (error) {
			Logger?.instance?.logger?.error(error);
			console.error(error);
		}
	}
}
