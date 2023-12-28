// Utils.
import { UtilApp } from './utils/app';
import { UtilDialog } from './utils/dialog';
import { UtilCxperium } from './utils/cxperium';

// Interfaces.
import { ISrcIndexConfig } from './interfaces/src-index';

// Helpers.
import applyClassMixins from './helpers/apply-class-mixins';

export interface Engine extends UtilApp, UtilDialog, UtilCxperium {}

export class Engine {
	constructor(data: ISrcIndexConfig) {
		// Initialize express application.
		this.initExpress();

		// Set App properties.
		this.initAppProperties(data);

		// Initialize middlewares.
		this.initMiddlewares();

		// Initialize dialog.
		this.initDialogProperties(data);

		this.app.listDialog = this.initDialog();
		this.app.getDialog = this.catchDialog;

		// Initialize cxperium.
		this.initCxperiumProperties(data);
	}
}

applyClassMixins.run(Engine, [UtilApp, UtilDialog, UtilCxperium]);
