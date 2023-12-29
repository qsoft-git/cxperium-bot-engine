// Node modules.
import { Request, Response, NextFunction } from 'express';

// Services.
import ServiceCxperiumLanguage from '../services/cxperium/language';

export default class {
	public static async execute(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const service = req.url;

			// const sss: ServiceCxperiumLanguage =
			// 	res.app.locals.service.cxperium.language;

			// await sss.getAllLanguage();

			// res.send();
			// return;

			if (service.startsWith('/whatsapp')) {
				res.locals.whichService = 'WHATSAPP';
				next();
			} else if (service.startsWith('/teams')) {
				res.locals.whichService = 'TEAMS';
				next();
			} else if (service.startsWith('/webchat')) {
				res.locals.whichService = 'WEBCHAT';
				next();
			} else {
				res.send();
			}
		} catch (error) {
			console.log(error);
			res.send();
		}
	}
}
