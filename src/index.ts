// Envrionments.
const { PORT, HOST, API_KEY, CALLBACK_URL } = process.env;

// Utils.
import { UtilApp } from './utils/app';
import { UtilDialog } from './utils/dialog';
import { UtilCxperium } from './utils/cxperium';
import { UtilWhatsApp } from './utils/whatsapp';

// Interfaces.
import { IDialog } from './interfaces/dialog';

// Types.
import { TSrcIndexConfig } from './types/src-index';
import { TBaseDialogCtor } from './types/base-dialog';

// Services.
import ServiceWhatsappBaseDialog from './services/whatsapp/base-dialog';
import ServiceMicrosoftBaseDialog from './services/microsoft/base-dialog';

// Helpers.
import applyClassMixins from './helpers/apply-class-mixins';
import { UtilAutomate } from './utils/automate';

// Mixins.
export interface Engine
	extends UtilApp,
		UtilDialog,
		UtilCxperium,
		UtilWhatsApp,
		UtilAutomate {}

export class Engine {
	constructor(srcPath: string) {
		// Process on.
		this.processOn();

		// Config.
		const data: TSrcIndexConfig | any = {
			host: HOST,
			port: PORT,
			apiKey: API_KEY,
			callbackUrl: CALLBACK_URL,
			srcPath,
		};

		// Initialize express application.
		this.initExpress();

		// Set App properties.
		this.initAppProperties(data);

		// Initialize middlewares.
		this.initMiddlewares();

		// Initialize properties.
		this.initCxperiumProperties(data);
		this.initDialogProperties(data);
		this.initWhatsAppProperties(data);

		// Initialize services.
		this.initCxperiumService();
		this.initWhatsAppService();

		// Initialize automate.
		this.initAutomateService();

		this.initDialogService();

		// Initialize app services.
		this.initAppService(
			this.serviceCxperiumMain,
			this.serviceCxperiumContact,
			this.serviceCxperiumUser,
			this.serviceCxperiumIntent,
			this.serviceCxperiumReport,
			this.serviceCxperiumTicket,
			this.serviceCxperiumSession,
			this.serviceCxperiumConversation,
			this.serviceCxperiumLanguage,
			this.serviceCxperiumMessage,
			this.serviceCxperiumConfiguration,
			this.serviceCxperiumTransfer,
			this.serviceWhatsApp,
			this.serviceWhatsAppMessage,
			this.serviceWhatsAppMedia,
			this.serviceAutomateUser,
			this.serviceAutomateApi,
			this.serviceDialog,
		);
	}

	private processOn() {
		process.on('SIGTERM', async () => {
			console.log('Received SIGTERM signal, shutting down...');
			process.exit(1);
		});

		process.on('SIGINT', async () => {
			console.log('Received SIGINT signal, shutting down...');
			process.exit(1);
		});

		process.on('uncaughtException', (error) => {
			console.error('Uncaught Exception:', error);
			process.exit(1);
		});

		process.on('unhandledRejection', (reason, promise) => {
			console.error(
				'Unhandled Rejection at:',
				promise,
				'reason:',
				reason,
			);
			process.exit(1);
		});

		process.on('warning', (warning) => {
			console.warn('Warning:', warning);
		});

		process.on('exit', (code) => {
			console.log('Process exit with code:', code);
		});

		process.on('beforeExit', (code) => {
			console.log('Process beforeExit with code:', code);
		});

		process.on('disconnect', () => {
			console.log('Process disconnect');
		});

		process.on('message', (message, sendHandle) => {
			console.log('Process message:', message, sendHandle);
		});

		process.on('multipleResolves', (type, promise, reason) => {
			console.log('Process multipleResolves:', type, promise, reason);
		});

		process.on('rejectionHandled', (promise) => {
			console.log('Process rejectionHandled:', promise);
		});

		process.on('uncaughtExceptionMonitor', (error, origin) => {
			console.log('Process uncaughtExceptionMonitor:', error, origin);
		});
	}
}

applyClassMixins.run(Engine, [
	UtilApp,
	UtilDialog,
	UtilCxperium,
	UtilWhatsApp,
	UtilAutomate,
]);

export {
	ServiceWhatsappBaseDialog,
	ServiceMicrosoftBaseDialog,
	IDialog,
	TBaseDialogCtor,
};
