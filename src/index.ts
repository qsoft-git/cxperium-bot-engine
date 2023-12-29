// Utils.
import { UtilApp } from './utils/app';
import { UtilDialog } from './utils/dialog';
import { UtilCxperium } from './utils/cxperium';

// Interfaces.
import { ISrcIndexConfig } from './interfaces/src-index';
import { IDialog } from './interfaces/dialog';

// Services.
import ServiceBaseDialog from './services/base-dialog';

// Helpers.
import applyClassMixins from './helpers/apply-class-mixins';

// Mixins.
export interface Engine extends UtilApp, UtilDialog, UtilCxperium {}

export class Engine {
	constructor(data: ISrcIndexConfig) {
		// Initialize express application.
		this.initExpress();

		// Set App properties.
		this.initAppProperties(data);

		// Initialize middlewares.
		this.initMiddlewares();

		// Initialize properties.
		this.initCxperiumProperties(data);
		this.initDialogProperties(data);

		// Initialize services.
		this.initCxperiumService();
		this.initDialogService();

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
			this.serviceDialog,
		);
	}
}

applyClassMixins.run(Engine, [UtilApp, UtilDialog, UtilCxperium]);

export { ServiceBaseDialog, IDialog };
