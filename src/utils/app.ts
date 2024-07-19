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
import http from 'http';
import * as Sentry from '@sentry/node';

// Routes.
import routes from '../routes';

// Middlewares.
import middlewareMain from '../middlewares/main';

// Interfaces.
import { IUtilsApp } from '../interfaces/utils/app';

// Types.
import { TSrcIndexConfig } from '../types/src-index';
import { TAppLocalsServices } from '../types/base-dialog';

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
import ServiceCxperiumMessage from '../services/cxperium/message';
import ServiceCxperiumConfiguration from '../services/cxperium/configuration';
import ServiceCxperiumTransfer from '../services/cxperium/transfer';
import ServiceCxperiumShoppingCart from '../services/cxperium/shopping-cart';
import ServiceDialog from '../services/dialog';
import ServiceAutomateUser from '../services/automate/user';
import ServiceAutomateApi from '../services/automate/api';
import ServiceWhatsAppMessage from '../services/whatsapp/message';
import ServiceWhatsAppMain from '../services/whatsapp/main';
import ServiceWhatsAppMedia from '../services/whatsapp/media';
import NodeCache from 'node-cache';

// Init services.
const appLocalsServices: TAppLocalsServices | any = {};

export class UtilApp implements IUtilsApp {
	server!: http.Server;
	app!: Application;
	host!: string;
	port!: string;
	publicPath!: string;
	mode!: string;

	public initExpress(): void {
		this.app = express();
	}

	public initAppProperties({
		host: _host,
		port: _port,
		srcPath: _srcPath,
		mode: _mode,
	}: TSrcIndexConfig): void {
		this.port = _port || '3978';
		this.host = _host || 'localhost';
		this.publicPath = path.join(_srcPath, '/', 'public');
		this.mode = _mode || 'development';
	}

	public initMiddlewares(sentry: typeof Sentry): void {
		// Set sentry request handler.
		this.app.use(sentry.Handlers.requestHandler());

		// Set general middlewares.
		this.initGeneralMiddlewares();

		// Set sentry tracing handler.
		this.app.use(sentry.Handlers.tracingHandler());

		// Set routes.
		this.app.use(routes);

		// Set error middlewares.
		this.app.use(sentry.Handlers.errorHandler());
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
		this.app.locals.service.sentry = {};
		this.app.locals.service.cxperium = {};
		this.app.locals.service.dialog = {};
		this.app.locals.service.whatsapp = {};

		if (this.publicPath) {
			this.app.use(express.static(this.publicPath));
		}
	}

	initAppService(
		serviceCxperiumMain: ServiceCxperiumMain,
		serviceCxperiumContact: ServiceCxperiumContact,
		serviceCxperiumUser: ServiceCxperiumUser,
		serviceCxperiumIntent: ServiceCxperiumIntent,
		serviceCxperiumReport: ServiceCxperiumReport,
		serviceCxperiumTicket: ServiceCxperiumTicket,
		serviceCxperiumSession: ServiceCxperiumSession,
		serviceCxperiumConversation: ServiceCxperiumConversation,
		serviceCxperiumLanguage: ServiceCxperiumLanguage,
		serviceCxperiumMessage: ServiceCxperiumMessage,
		serviceCxperiumConfiguration: ServiceCxperiumConfiguration,
		serviceCxperiumTransfer: ServiceCxperiumTransfer,
		serviceCxperiumShoppingCart: ServiceCxperiumShoppingCart,
		serviceWhatsAppMain: ServiceWhatsAppMain,
		serviceWhatsAppMessage: ServiceWhatsAppMessage,
		serviceWhatsAppMedia: ServiceWhatsAppMedia,
		serviceAutomateUser: ServiceAutomateUser,
		serviceAutomateApi: ServiceAutomateApi,
		serviceDialog: ServiceDialog,
		sentry: typeof Sentry,
	): void {
		appLocalsServices.dialog = serviceDialog;
		appLocalsServices.cxperium = {};
		appLocalsServices.whatsapp = {};
		appLocalsServices.automate = {};
		appLocalsServices.cxperium.main = serviceCxperiumMain;
		appLocalsServices.cxperium.contact = serviceCxperiumContact;
		appLocalsServices.cxperium.user = serviceCxperiumUser;
		appLocalsServices.cxperium.intent = serviceCxperiumIntent;
		appLocalsServices.cxperium.report = serviceCxperiumReport;
		appLocalsServices.cxperium.ticket = serviceCxperiumTicket;
		appLocalsServices.cxperium.session = serviceCxperiumSession;
		appLocalsServices.cxperium.conversation = serviceCxperiumConversation;
		appLocalsServices.cxperium.language = serviceCxperiumLanguage;
		appLocalsServices.cxperium.message = serviceCxperiumMessage;
		appLocalsServices.cxperium.configuration = serviceCxperiumConfiguration;
		appLocalsServices.cxperium.transfer = serviceCxperiumTransfer;
		appLocalsServices.cxperium.shoppingCart = serviceCxperiumShoppingCart;
		appLocalsServices.whatsapp.main = serviceWhatsAppMain;
		appLocalsServices.whatsapp.message = serviceWhatsAppMessage;
		appLocalsServices.whatsapp.media = serviceWhatsAppMedia;
		appLocalsServices.automate.user = serviceAutomateUser;
		appLocalsServices.automate.api = serviceAutomateApi;
		appLocalsServices.sentry = sentry;

		this.app.locals.service = appLocalsServices;
	}

	public execute(): void {
		this.app.set('env', this.mode);
		this.app.set('port', this.port);
		this.app.set('host', this.host);
		this.app.set('nodeCache', new NodeCache());
		this.server = http.createServer(this.app);
		this.server.listen(this.port);
		this.server.on('error', this.serverOnError(this.port));
		this.server.on(
			'listening',
			this.serverOnListening(this.mode, this.host, this.port),
		);
	}

	private serverOnListening(
		mode: string | undefined,
		host: string,
		port: string,
	) {
		return function () {
			console.table({
				mode,
				host,
				port,
				message: 'Listening Cxperium ChatBot Engine',
			});
		};
	}

	private serverOnError(port: string) {
		return function (error: any) {
			if (error.syscall !== 'listen') {
				throw error;
			}

			const bind =
				typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

			switch (error.code) {
				case 'EACCES':
					console.error(bind + ' requires elevated privileges');
					process.exit(1);
				case 'EADDRINUSE':
					console.error(bind + ' is already in use');
					process.exit(1);
				default:
					throw error;
			}
		};
	}
}
