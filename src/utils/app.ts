// Environment.
const { NODE_ENV, SENTRY_DSN } = process.env;

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
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

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
import ServiceDialog from '../services/dialog';
import ServiceAutomateUser from '../services/automate/user';
import ServiceAutomateApi from '../services/automate/api';
import ServiceWhatsAppMessage from '../services/whatsapp/message';
import ServiceWhatsAppMain from '../services/whatsapp/main';
import ServiceWhatsAppMedia from '../services/whatsapp/media';

// Init services.
const appLocalsServices: TAppLocalsServices | any = {};

export class UtilApp implements IUtilsApp {
	app!: Application;
	host!: string;
	port!: string;
	publicPath!: string;

	public initExpress(): void {
		this.app = express();
		this.initSentry();
	}

	public initAppProperties({
		host: _host,
		port: _port,
		srcPath: _srcPath,
	}: TSrcIndexConfig): void {
		this.port = _port || '3978';
		this.host = _host || 'localhost';
		this.publicPath = path.join(_srcPath, '/', 'public');
	}

	public initMiddlewares(): void {
		// Sentry
		this.app.use(Sentry.Handlers.requestHandler());

		// Set general middlewares.
		this.initGeneralMiddlewares();

		this.app.use(Sentry.Handlers.tracingHandler());

		// Set routes and middlewares.
		this.app.use(routes);
		this.app.use(Sentry.Handlers.errorHandler());
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
		this.app.locals.service.sentry = Sentry;
		this.app.locals.service.cxperium = {};
		this.app.locals.service.dialog = {};
		this.app.locals.service.whatsapp = {};

		if (this.publicPath) {
			this.app.use(express.static(this.publicPath));
		}
	}

	public initSentry() {
		if (SENTRY_DSN)
			Sentry.init({
				dsn: SENTRY_DSN,
				integrations: [
					// enable HTTP calls tracing
					new Sentry.Integrations.Http({ tracing: true }),
					// enable Express.js middleware tracing
					new Sentry.Integrations.Express({ app: this.app }),
					new ProfilingIntegration(),
				],
				// Performance Monitoring
				tracesSampleRate: 1.0, //  Capture 100% of the transactions
				// Set sampling rate for profiling - this is relative to tracesSampleRate
				profilesSampleRate: 1.0,
			});
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
		serviceWhatsAppMain: ServiceWhatsAppMain,
		serviceWhatsAppMessage: ServiceWhatsAppMessage,
		serviceWhatsAppMedia: ServiceWhatsAppMedia,
		serviceAutomateUser: ServiceAutomateUser,
		serviceAutomateApi: ServiceAutomateApi,
		serviceDialog: ServiceDialog,
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
		appLocalsServices.whatsapp.main = serviceWhatsAppMain;
		appLocalsServices.whatsapp.message = serviceWhatsAppMessage;
		appLocalsServices.whatsapp.media = serviceWhatsAppMedia;
		appLocalsServices.automate.user = serviceAutomateUser;
		appLocalsServices.automate.api = serviceAutomateApi;

		this.app.locals.service = {
			...this.app.locals.service,
			...appLocalsServices,
		};
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
