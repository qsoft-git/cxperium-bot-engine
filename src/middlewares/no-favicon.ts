import { Request, Response, NextFunction } from 'express';

export default function (req: Request, res: Response, next: NextFunction) {
	req.url === '/favicon.ico' ? res.status(204).end() : next();
}
