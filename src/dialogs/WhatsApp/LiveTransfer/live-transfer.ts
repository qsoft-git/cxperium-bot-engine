import { IDialog, ServiceBaseDialog } from '../../..';
import { TButton } from '../../../types/whatsapp/message';

export default class extends ServiceBaseDialog implements IDialog {
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
			// var cxLiveHelper = new CxLiveHelper(
			// 	Contact,
			// 	Activity,
			// 	Conversation,
			// );
			// cxLiveHelper.TransferToRepresentative(Contact, Conversation);
		}
	}
}
