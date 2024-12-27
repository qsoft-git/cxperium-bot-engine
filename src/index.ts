// ? Environments.
const { PORT, HOST, API_KEY, CALLBACK_URL, SENTRY_DSN, NODE_ENV } = process.env;

// ? Types.
import { TSrcIndexConfig } from './types/src-index';
import { TBaseDialogCtor } from './types/base-dialog';

// ? Interfaces.
import { IDialog } from './interfaces/dialog';
import { IFlow } from './interfaces/flow';
import { IMessageEvent } from './interfaces/message-event';

// ? Utils.
import { UtilApp } from './utils/app';
import { UtilDialog } from './utils/dialog';
import { UtilCxperium } from './utils/cxperium';
import { UtilWhatsApp } from './utils/whatsapp';
import { UtilRouter } from './utils/router';

// ? Helpers.
import applyClassMixins from './helpers/apply-class-mixins';
import Logger from './helpers/winston-loki';

// ? Services.
import ServiceWhatsappBaseDialog from './services/whatsapp/base-dialog';
import { UtilLogger } from './utils/logger';

// ? Mixins.
export interface Engine
	extends UtilApp,
		UtilDialog,
		UtilCxperium,
		UtilWhatsApp,
		UtilRouter {}

export class Engine {
	logger: Logger = Logger.instance;

	constructor(srcPath: string) {
		// Config.
		const data: TSrcIndexConfig | any = {
			host: HOST,
			port: PORT,
			apiKey: API_KEY,
			callbackUrl: CALLBACK_URL,
			sentryDsn: SENTRY_DSN,
			mode: NODE_ENV,
			srcPath,
		};

		// Initialize express application.
		this.initExpress();

		// Process on.
		this.logger.processOn();

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

		// Initialize dialog.
		this.initDialogService();

		this.exportRouter();

		// Initialize app services.
		this.initAppService(
			this.serviceCxperiumMain,
			this.serviceCxperiumContact,
			this.serviceCxperiumUser,
			this.serviceCxperiumIntent,
			this.serviceCxperiumReport,
			this.serviceCxperiumTicket,
			this.serviceCxperiumSession,
			this.serviceCxperiumChat,
			this.serviceCxperiumLanguage,
			this.serviceCxperiumMessage,
			this.serviceCxperiumConfiguration,
			this.serviceCxperiumTransfer,
			this.serviceCxperiumShoppingCart,
			this.serviceWhatsApp,
			this.serviceWhatsAppMessage,
			this.serviceWhatsAppMedia,
			this.serviceDialog,
		);
	}
}

applyClassMixins.run(Engine, [
	UtilApp,
	UtilDialog,
	UtilCxperium,
	UtilWhatsApp,
	UtilLogger,
	UtilRouter,
]);

export {
	ServiceWhatsappBaseDialog,
	IDialog,
	IMessageEvent,
	IFlow,
	TBaseDialogCtor,
};
