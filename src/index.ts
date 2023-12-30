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
import ServiceBaseDialog from './services/base-dialog';

// Helpers.
import applyClassMixins from './helpers/apply-class-mixins';

// Mixins.
export interface Engine
	extends UtilApp,
		UtilDialog,
		UtilCxperium,
		UtilWhatsApp {}

export class Engine {
	constructor(data: TSrcIndexConfig) {
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
			this.serviceWhatsApp,
			this.serviceWhatsAppMessage,
			this.serviceDialog,
		);
	}
}

applyClassMixins.run(Engine, [UtilApp, UtilDialog, UtilCxperium, UtilWhatsApp]);

export { ServiceBaseDialog, IDialog, TBaseDialogCtor };
