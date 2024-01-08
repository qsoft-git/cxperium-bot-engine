// Node modules.
import { IDialog, ServiceBaseDialog, TBaseDialogCtor } from '../../../../index';
import { TButton } from '../../../../types/whatsapp/message';

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
					await this.services.cxperium.contact.updateGdprApprovalStatus(
						this.contact,
						true,
					);

					const isSurveyTransfer =
						await this.services.cxperium.transfer.isSurveyTransfer(
							this.contact,
							this.activity,
							this.conversation,
						);

					if (!isSurveyTransfer) {
						this.services.dialog.runWithIntentName(
							this,
							'CXPerium.Dialogs.WhatsApp.WelcomeDialog',
						);
						return;
					}

					break;
				}
				case 'kvkk_red': {
					await this.sendMessage(
						await this.getLocalizationText('gdpr_no'),
					);
					break;
				}
				default: {
					await this.sendKvkkMessage();
					break;
				}
			}
		}
	}

	private async sendKvkkMessage() {
		await this.sendMessage(
			await this.getLocalizationText('gdpr_welcome_message'),
		);

		await this.sendMessage(await this.getLocalizationText('gdpr_message'));

		const buttons: TButton[] = [
			{
				type: 'reply',
				reply: {
					id: 'kvkk_approve',
					title: await this.getLocalizationText('approve'),
				},
			},
			{
				type: 'reply',
				reply: {
					id: 'kvkk_red',
					title: await this.getLocalizationText('deny'),
				},
			},
		];

		await this.sendButtonMessage(
			await this.getLocalizationText('info'),
			'',
			await this.getLocalizationText('gdpr_question'),
			buttons,
		);
	}
}
