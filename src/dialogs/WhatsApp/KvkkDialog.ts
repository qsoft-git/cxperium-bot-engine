// Node modules.
import { IDialog, ServiceBaseDialog, TBaseDialogCtor } from '../../index';

export default class extends ServiceBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}

	runDialog() {
		console.log('Run Rialog - KVKK');
	}
}
