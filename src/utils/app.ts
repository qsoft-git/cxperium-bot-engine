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
import { ISrcIndexConfig } from '../interfaces/src-index';

// Services.
import ServiceCxperiumMain from '../services/cxperium/main';
import ServiceCxperiumContact from '../services/cxperium/contact';
import ServiceCxperiumUser from '../services/cxperium/user';
import ServiceCxperiumIntent from '../services/cxperium/intent';
import ServiceCxperiumReport from '../services/cxperium/report';
import ServiceCxperiumTicket from '../services/cxperium/ticket';
import ServiceCxperiumSession from '../services/cxperium/session';
import ServiceCxperiumConversation from '../services/cxperium/conversation';
import ServiceCxperiumLanguage from '../services/cxperium/language';

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
	}: ISrcIndexConfig): void {
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
		this.app.locals.service = {};
		this.app.locals.service.cxperium = {};
		this.app.locals.service.dialog = {};

		if (this.publicPath) {
			this.app.use(express.static(this.publicPath));
		}
	}

	initCxperiumService(
		serviceCxperiumMain: ServiceCxperiumMain,
		serviceCxperiumContact: ServiceCxperiumContact,
		serviceCxperiumUser: ServiceCxperiumUser,
		serviceCxperiumIntent: ServiceCxperiumIntent,
		serviceCxperiumReport: ServiceCxperiumReport,
		serviceCxperiumTicket: ServiceCxperiumTicket,
		serviceCxperiumSession: ServiceCxperiumSession,
		serviceCxperiumConversation: ServiceCxperiumConversation,
		serviceCxperiumLanguage: ServiceCxperiumLanguage,
	): void {
		this.app.locals.service.cxperium.main = serviceCxperiumMain;
		this.app.locals.service.cxperium.contact = serviceCxperiumContact;
		this.app.locals.service.cxperium.user = serviceCxperiumUser;
		this.app.locals.service.cxperium.intent = serviceCxperiumIntent;
		this.app.locals.service.cxperium.report = serviceCxperiumReport;
		this.app.locals.service.cxperium.ticket = serviceCxperiumTicket;
		this.app.locals.service.cxperium.session = serviceCxperiumSession;
		this.app.locals.service.cxperium.conversation =
			serviceCxperiumConversation;
		this.app.locals.service.cxperium.language = serviceCxperiumLanguage;
	}

	initDialogService(listAll: any, run: any): void {
		this.app.locals.service.dialog.listAll = listAll;
		this.app.locals.service.dialog.run = run;
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
