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

		// Initialize dialog.
		this.initDialogProperties(data);
		this.initDialogList();

		// Initialize cxperium.
		this.initCxperiumProperties(data);
		this.initServiceMain();
		this.initCxperiumService(
			this.serviceCxperiumMain,
			this.serviceCxperiumContact,
			this.serviceCxperiumUser,
		);

		// Test dialog run.
		const testDialog: any = this.dialogList.find((dialog:any ) => dialog.name === 'TEST');
		this.catchDialog(testDialog.path).then((Dialog) => {
			const dialog = new Dialog.default({ name: "Test Dialog", description: "Test Dialog Description" });
			dialog.runDialog();
		});
	}
}

applyClassMixins.run(Engine, [UtilApp, UtilDialog, UtilCxperium]);

export { ServiceBaseDialog ,IDialog };