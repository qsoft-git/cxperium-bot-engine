// Node modules.
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import expressFileUpload from 'express-fileupload';
import noCache from 'nocache';
import cookieParser from 'cookie-parser';

// Middlewares.
import middlewareNoFavicon from '../middlewares/no-favicon';

export default function generalMiddlewares(
	app: express.Application,
	publicPath: string,
): void {
	app.use(helmet());
	app.use(morgan('short'));
	app.use(cors());
	app.use(cookieParser());
	app.use(express.json());
	app.use(expressFileUpload());
	app.use(express.urlencoded({ extended: true }));
	app.use(compression());
	app.use(noCache());
	app.use(middlewareNoFavicon);

	if (publicPath) {
		app.use(express.static(publicPath));
	}
}
