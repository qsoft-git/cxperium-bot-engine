// Node modules.
import { Request, Response } from 'express';

// Services.
import ServiceWhatsappRunDialog from '../services/whatsapp/run-dialog';

export default class {
	static async executeWhatsapp(req: Request, res: Response): Promise<void> {
		res.send();

		const body = req.body;

		if (!body?.contacts || !body?.messages) {
			console.error('Bad request!!!');
			return;
		}

		try {
			const serviceRunDialog = new ServiceWhatsappRunDialog(req);
			await serviceRunDialog.execute();
		} catch (error) {
			const sentry = res.app.locals.service.sentry;
			sentry.captureException(error);
			console.error(error);
		}
	}
}
