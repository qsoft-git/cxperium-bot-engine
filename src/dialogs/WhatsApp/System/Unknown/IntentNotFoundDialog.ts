// Types.
import {
	IDialog,
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
} from '../../../../index';

export default class extends ServiceWhatsappBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}
	async runDialog(): Promise<void> {
		await this.sendMessage(
			await this.getLocalizationText('understand_message'),
		);
	}
}
