// Types.
import { IDialog, ServiceBaseDialog, TBaseDialogCtor } from '../../../../index';

export default class extends ServiceBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}
	async runDialog(): Promise<void> {
		await this.sendMessage(
			await this.getLocalizationText('understand_message'),
		);
	}
}
