import { IDialog, ServiceBaseDialog, TBaseDialogCtor } from '../../../..';

export default class extends ServiceBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}

	runDialog(): void {
		throw new Error('Method not implemented.');
	}
}
