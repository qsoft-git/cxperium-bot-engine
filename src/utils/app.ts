// Environment.
const { NODE_ENV } = process.env;

// Node modules.
import express, { Application } from 'express';
import * as path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import expressFileUpload from 'express-fileupload';
import noCache from 'nocache';
import cookieParser from 'cookie-parser';

// Routes.
import routes from '../routes';

// Middlewares.
import middlewareMain from '../middlewares/main';

// Interfaces.
import { IUtilsApp } from '../interfaces/utils/app';
import { SrcIndexConfig } from '../interfaces/src-index';

export class UtilApp implements IUtilsApp {
	app!: Application;
	host!: string;
	port!: string;
	publicPath!: string;

	public initExpress(): void {
		this.app = express();
	}

	public initAppProperties({
		host: _host,
		port: _port,
		srcPath: _srcPath,
	}: SrcIndexConfig): void {
		this.port = _port || '3978';
		this.host = _host || 'localhost';
		this.publicPath = path.join(_srcPath, '/', 'public');
	}

	public initMiddlewares(): void {
		// Set general middlewares.
		this.initGeneralMiddlewares();

		// Set routes and middlewares.
		this.app.use(routes);
		this.app.use(middlewareMain.notFoundHandler);
		this.app.use(middlewareMain.errorHandler);
	}

	public initGeneralMiddlewares(): void {
		this.app.use(helmet());
		this.app.use(middlewareMain.noFaviconHandler);
		this.app.use(morgan('short'));
		this.app.use(
			cors({
				origin: '*',
				optionsSuccessStatus: 200,
			}),
		);
		this.app.use(cookieParser());
		this.app.use(express.json());
		this.app.use(expressFileUpload());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(compression());
		this.app.use(noCache());
		this.app.use(
			'/static',
			express.static(path.join(__dirname, '../', 'public')),
		);
		this.app.set('views', path.join(__dirname, '../', 'views'));
		this.app.set('view engine', 'ejs');

		if (this.publicPath) {
			this.app.use(express.static(this.publicPath));
		}
	}

	public execute(): void {
		this.app.listen(this.port, () => {
			console.table({
				mode: NODE_ENV,
				host: this.host,
				port: this.port,
				message: 'Listening Cxperium ChatBot Engine',
			});
		});
	}
}
