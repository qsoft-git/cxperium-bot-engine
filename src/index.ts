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

// Constant.

// Mixins.
export interface Engine
	extends UtilApp,
		UtilDialog,
		UtilCxperium,
		UtilWhatsApp,
		UtilAutomate {}

export class Engine {
	constructor(srcPath: string) {
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
