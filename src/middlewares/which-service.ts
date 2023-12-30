// Node modules.
import { Request, Response, NextFunction } from 'express';
import ServiceCxperiumConfiguration from '../services/cxperium/configuration';

export default class {
	public static async execute(
		req: Request,
		res: Response,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		next: NextFunction,
	): Promise<void> {
		try {
			// const service = req.url;
			const config: ServiceCxperiumConfiguration =
				res.app.locals.service.cxperium.configuration;
			const env = await config.execute();

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
