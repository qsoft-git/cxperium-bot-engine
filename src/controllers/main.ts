// Node modules.
import { Request, Response, NextFunction } from 'express';

export default class {
	public static homePage(
		_req: Request,
		res: Response,
		next: NextFunction,
	): void {
		try {
			const aaaa = res.app.listDialog;

			res.send('Hello World!');

			// 	const busyMode = !!res.app.locals.busy ? "ACTIVE" : "PASSIVE";

			// return res.render('home-page', {
			//     title: 'Destek Patent - Newsletter Extractor - API',
			//     version: packageJson.version,
			//     license: packageJson.license,
			//     author: packageJson.author,
			//     uptime: UPTIME,
			//     busyMode
			// });
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

	public static test(_req: Request, res: Response, next: NextFunction): void {
		try {
			res.send();
		} catch (error) {
			next(error);
		}
	}
}
