import { Request, Response, NextFunction } from 'express';

export default class {
	public static execute(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		const service = req.url;

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
