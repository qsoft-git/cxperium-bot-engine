// Node modules.
import { Request, Response, NextFunction } from 'express';

// Helpers.
import getPackageJson from '../helpers/get-package-json';

// Constants.
const UP_TIME = new Date();

// Services.
import ServiceWhatsAppMedia from '../services/whatsapp/media';

export default class {
	public static homePage(
		_req: Request,
		res: Response,
		next: NextFunction,
	): void {
		try {
			const packageJson = getPackageJson.getJsonParse();
			return res.render('home-page', {
				description: packageJson.description,
				version: packageJson.version,
				license: packageJson.license,
				author: packageJson?.author,
				uptime: UP_TIME,
			});
		} catch (error) {
			next(error);
		}
	}

	public static errorTest(
		_req: Request,
		_res: Response,
		next: NextFunction,
	): void {
		try {
			throw new Error('Error test');
		} catch (error) {
			next(error);
		}
	}

	public static async test(
		_req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const serv: ServiceWhatsAppMedia =
				res.app.locals.service.whatsapp.media;

			await serv.uploadMediaWithUrl(
				'https://www.orimi.com/pdf-test.pdf',
				'application/pdf',
			);

			res.send();
			return;
		} catch (error) {
			next(error);
		}
	}
}
