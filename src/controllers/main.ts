// ? Node modules.
import { Request, Response, NextFunction } from 'express';

// ? Helpers.
import getPackageJson from '../helpers/get-package-json';
import Logger from '../helpers/winston-loki';

// ? Constants.
const UP_TIME = new Date();

export default class {
	public static homePage(
		_req: Request,
		res: Response,
		next: NextFunction,
	): void {
		try {
			const packageJson = getPackageJson.getJsonParse();
			const message = `description: ${packageJson.description}\nversion: ${packageJson.version}\nlicense: ${packageJson.license}\nauthor: ${packageJson?.author}\nuptime: ${UP_TIME}`;
			Logger?.instance?.logger?.info(message);

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

	public static callback(req: Request, res: Response, next: NextFunction) {
		try {
			console.info(
				`Message response: ${req.body.botMessageId} => ${JSON.stringify(
					req.body.graphResponse,
				)}`,
			);

			return res.status(200).json({
				message: 'Callback received.',
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
