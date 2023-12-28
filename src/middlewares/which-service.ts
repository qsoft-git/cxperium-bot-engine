// Node modules.
import { Request, Response, NextFunction } from 'express';

// Services.
import ServiceCxperiumMain from '../services/cxperium/main';

export default class {
	public static execute(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		const service = req.url;

		const serviceCxperiumMain: ServiceCxperiumMain =
			res.app.locals.service.cxperium.main;

		const baseUrl = serviceCxperiumMain.selam();
		const contact = serviceCxperiumMain.contact;

		if (service.startsWith('/whatsapp')) {
			res.locals.service = 'WHATSAPP';
			next();
		} else if (service.startsWith('/teams')) {
			res.locals.service = 'TEAMS';
			next();
		} else if (service.startsWith('/webchat')) {
			res.locals.service = 'WEBCHAT';
			next();
		} else {
			res.send();
		}
	}
}
