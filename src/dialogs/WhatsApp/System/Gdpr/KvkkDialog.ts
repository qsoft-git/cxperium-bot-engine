// Types.
import {
	IDialog,
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
} from '../../../../index';
import initEntryPoint from '../../../../services/whatsapp/init-entry-point';
import { TButton } from '../../../../types/whatsapp/message';

export default class extends ServiceWhatsappBaseDialog implements IDialog {
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
							this,
						);

					if (!isSurveyTransfer) {
						// Init EntryPoint.
						try {
							await initEntryPoint(this);
							return;
						} catch (error: any) {
							if (error?.message === 'end') {
								return;
							}
						}
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

	private async initEntryPoint(): Promise<void> {
		try {
			// Init custom needs dialog.
			await this.services.dialog.runWithIntentName(
				this,
				'CXPerium.Dialogs.WhatsApp.Entry',
			);

			await this.services.dialog.runWithIntentName(
				this,
				'CXPerium.Dialogs.WhatsApp.WelcomeDialog',
			);
		} catch (error: any) {
			if (error?.message === 'end') {
				throw new Error('end');
			}
			console.error(
				'Entry.ts has to be created to initialize project. Add Entry.ts class inside your channel file.',
			);
			process.exit(137);
		}
	}

	private async sendKvkkMessage() {
		await this.sendMessage(
			await this.getLocalizationText('gdpr_welcome_message'),
		);

		await this.sendMessage(await this.getLocalizationText('gdpr_message'));

		const buttons: TButton[] = [
			{
				id: 'kvkk_approve',
				title: await this.getLocalizationText('approve'),
			},
			{
				id: 'kvkk_red',
				title: await this.getLocalizationText('deny'),
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
