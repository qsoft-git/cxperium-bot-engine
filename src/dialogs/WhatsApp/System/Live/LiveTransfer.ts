import { IDialog, ServiceBaseDialog, TBaseDialogCtor } from '../../../..';
import { TButton } from '../../../../types/whatsapp/message';

export default class extends ServiceBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}

	async runDialog() {
		if (
			this.activity.value.id &&
			this.activity.value.id === 'humantransfer_no'
		) {
			this.services.cxperium.contact.updateLiveTransferStatus(
				this.contact,
				false,
			);
			const buttons: TButton[] = [
				{
					type: 'string',
					reply: {
						id: 'menu',
						title: await this.getLocalizationText('home_menu'),
					},
				},
			];

			await this.sendButtonMessage(
				await this.getLocalizationText('home_menu'),
				'',
				await this.getLocalizationText('continue_main_menu'),
				buttons,
			);
		} else {
			await this.services.cxperium.transfer.transferToRepresentative(
				this.contact,
				this.conversation,
			);
		}
	}
}
