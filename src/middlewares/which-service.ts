// Node modules.
import { Request, Response, NextFunction } from 'express';

// Services.
export default class {
	public static async execute(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
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
