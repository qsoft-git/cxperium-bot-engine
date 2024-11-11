// ? Node modules.
import { Request, Response, NextFunction } from 'express';

// ? Helpers.
import Logger from '../helpers/winston-loki';

export default class {
	public static errorHandler(
		error: unknown,
		req: Request,
		res: Response,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_next: NextFunction,
	) {
		try {
			const serverMode = req.app.get('env');
			const notFoundStatus = res.locals.notFoundStatus;
			const statusCode = notFoundStatus ? 404 : 406;

			const params: Record<string, any> = {
				status: false,
				message: error,
			};

			if (serverMode === 'development') {
				params.stack = (error as Error).stack;
			}

			res.status(statusCode).json(params);
			console.error(error);
			Logger?.instance?.logger?.error(error);
		} catch (error) {
			console.error(error);
		}
	}

	public static noFaviconHandler(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		try {
			req.url === '/favicon.ico' ? res.status(204).end() : next();
		} catch (error) {
			next(error);
		}
	}

	public static notFoundHandler(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		try {
			const message = `Not found: ${req.url}`;
			const error = new Error(message);
			res.locals.notFoundStatus = true;
			Logger?.instance?.logger?.error(message);
			next(error);
		} catch (error) {
			next(error);
		}
	}
}
