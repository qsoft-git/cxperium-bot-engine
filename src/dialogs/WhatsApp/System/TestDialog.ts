import { IDialog, ServiceBaseDialog, TBaseDialogCtor } from '../../../index';

export default class extends ServiceBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}

	async runDialog() {
		console.log('Run TestDialog!!!');
	}
}
