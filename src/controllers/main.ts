// Node modules.
import { Request, Response, NextFunction } from 'express';

// Helpers.
import getPackageJson from '../helpers/get-package-json';

// Constants.
const UP_TIME = new Date();

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
}
