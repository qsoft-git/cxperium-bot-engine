// Envrionments.
const { PORT, HOST, API_KEY, CALLBACK_URL, SENTRY_DSN, NODE_ENV } = process.env;

// Utils.
import { UtilApp } from './utils/app';
import { UtilDialog } from './utils/dialog';
import { UtilCxperium } from './utils/cxperium';
import { UtilWhatsApp } from './utils/whatsapp';
import { UtilAutomate } from './utils/automate';
import { UtilSentry } from './utils/sentry';

// Interfaces.
import { IDialog } from './interfaces/dialog';
import { IFlow } from './interfaces/flow';

// Types.
import { TSrcIndexConfig } from './types/src-index';
import { TBaseDialogCtor } from './types/base-dialog';

// Services.
import ServiceWhatsappBaseDialog from './services/whatsapp/base-dialog';
import ServiceMicrosoftBaseDialog from './services/microsoft/base-dialog';

// Helpers.
import applyClassMixins from './helpers/apply-class-mixins';

// Mixins.
export interface Engine
	extends UtilApp,
		UtilDialog,
		UtilCxperium,
		UtilWhatsApp,
		UtilAutomate,
		UtilSentry {}

export class Engine {
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

		// Initialize sentry properties.
		this.initSentryProperties(data, this.app);

		// Process on.
		this.processOn();

		// Set App properties.
		this.initAppProperties(data);

		// Initialize middlewares.
		this.initMiddlewares(this.sentry);

		// Initialize properties.
		this.initCxperiumProperties(data);
		this.initDialogProperties(data);
		this.initWhatsAppProperties(data);

		// Initialize services.
		this.initCxperiumService();
		this.initWhatsAppService();

		// Initialize automate.
		this.initAutomateService();

		// Initialize dialog.
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
			this.serviceCxperiumShoppingCart,
			this.serviceWhatsApp,
			this.serviceWhatsAppMessage,
			this.serviceWhatsAppMedia,
			this.serviceAutomateUser,
			this.serviceAutomateApi,
			this.serviceDialog,
			this.sentry,
		);
	}
}

applyClassMixins.run(Engine, [
	UtilApp,
	UtilDialog,
	UtilCxperium,
	UtilWhatsApp,
	UtilAutomate,
	UtilSentry,
]);

export {
	ServiceWhatsappBaseDialog,
	ServiceMicrosoftBaseDialog,
	IDialog,
	IFlow,
	TBaseDialogCtor,
};
