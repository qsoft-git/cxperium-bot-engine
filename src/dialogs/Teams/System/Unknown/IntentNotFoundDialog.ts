// Types.
import {
	IDialog,
	ServiceMicrosoftBaseDialog,
	TBaseDialogCtor,
} from '../../../../index';

export default class extends ServiceMicrosoftBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}
	async runDialog(): Promise<void> {
		await this.sendMessage(
			await this.getLocalizationText('understand_message'),
		);
	}
}
