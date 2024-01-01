// Node modules.
import { Request, Response, NextFunction } from 'express';

import ServiceWhatsAppMedia from '../services/whatsapp/media';

export default class {
	public static async execute(
		req: Request,
		res: Response,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		next: NextFunction,
	): Promise<void> {
		try {
			// const service = req.url;
			const serv: ServiceWhatsAppMedia =
				res.app.locals.service.whatsapp.media;

			await serv.uploadMediaWithUrl(
				'https://www.orimi.com/pdf-test.pdf',
				'application/pdf',
			);

			res.send();
			return;

			// if (service.startsWith('/whatsapp')) {
			// 	res.locals.whichService = 'WHATSAPP';
			// 	next();
			// } else if (service.startsWith('/teams')) {
			// 	res.locals.whichService = 'TEAMS';
			// 	next();
			// } else if (service.startsWith('/webchat')) {
			// 	res.locals.whichService = 'WEBCHAT';
			// 	next();
			// } else {
			// 	res.send();
			// }
		} catch (error) {
			console.log(error);
			res.send();
		}
	}
}
