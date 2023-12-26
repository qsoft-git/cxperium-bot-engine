import { Request, Response, NextFunction } from 'express';

export default function (req: Request, res: Response, next: NextFunction) {
	const message = `Not found: ${req.url}`;
	const error = new Error(message);
	res.locals.notFoundStatus = true;
	next(error);
}
