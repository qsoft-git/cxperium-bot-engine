// Node modules.
import { IDialog, ServiceBaseDialog, TBaseDialogCtor } from '../../../index';
import { TButton } from '../../../types/whatsapp/message';

export default class extends ServiceBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}

	async runDialog() {
		if (!this.activity.value.id) {
			this.sendKvkkMessage();
		} else {
			switch (this.activity.value.id) {
				case 'kvkk_approve': {
					this.services.cxperium.contact.updateGdprApprovalStatus(
						this.contact,
						true,
					);

					// TODO
					// if (
					// 	!CxperiumHelper.IsCXPeriumTransfer(
					// 		Contact,
					// 		Activity,
					// 		Conversation,
					// 	)
					// )

					// this.services.dialog.getListAll
					// 	new WelcomeDialog(
					// 		Contact,
					// 		Activity,
					// 		Conversation,
					// 	).RunDialog();

					break;
				}
				case 'kvkk_red': {
					this.sendMessage(await this.getLocalizationText('gdpr_no'));
					break;
				}
				default: {
					this.sendKvkkMessage();
					break;
				}
			}
		}
	}

	private async sendKvkkMessage() {
		this.sendMessage(
			await this.getLocalizationText('gdpr_welcome_message'),
		);

		this.sendMessage(await this.getLocalizationText('gdpr_message'));

		const buttons: TButton[] = [
			{
				type: 'string',
				reply: {
					id: 'kvkk_approval',
					title: await this.getLocalizationText('approve'),
				},
			},
			{
				type: 'string',
				reply: {
					id: 'kvkk_red',
					title: await this.getLocalizationText('deny'),
				},
			},
		];

		this.sendButtonMessage(
			await this.getLocalizationText('gdpr_question'),
			'',
			await this.getLocalizationText('info'),
			buttons,
		);
	}
}
