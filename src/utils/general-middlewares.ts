// Environments.
const { NODE_ENV } = process.env;

// Node modules.
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import expressFileUpload from 'express-fileupload';
import noCache from 'nocache';
import cookieParser from 'cookie-parser';
import * as path from 'path';

// Middlewares.
import middlewareMain from '../middlewares/main';

export default class {
	public static init(app: Application, publicPath: string): void {
		app.use(helmet());
		app.use(middlewareMain.noFaviconHandler);
		app.use(morgan('short'));
		app.use(
			cors({
				origin: '*',
				optionsSuccessStatus: 200,
			}),
		);
		app.use(cookieParser());
		app.use(express.json());
		app.use(expressFileUpload());
		app.use(express.urlencoded({ extended: true }));
		app.use(compression());
		app.use(noCache());
		app.use(
			'/static',
			express.static(path.join(__dirname, '../', 'public')),
		);
		app.set('views', path.join(__dirname, '../', 'views'));
		app.set('view engine', 'ejs');

		if (publicPath) {
			app.use(express.static(publicPath));
		}
	}
}
