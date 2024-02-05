// Types.
import { ActionTypes, CardFactory, MessageFactory } from 'botbuilder';
import {
	IDialog,
	ServiceMicrosoftBaseDialog,
	TBaseDialogCtor,
} from '../../../../index';
import initEntryPoint from '../../../../services/microsoft/teams/init-entry-point';

export default class extends ServiceMicrosoftBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}

	async runDialog() {
		const choices = ['kvkk_approve', 'kvkk_red'];
		if (!choices.includes(this.activity.text)) {
			await this.sendKvkkMessage();
		} else {
			switch (this.activity.text) {
				case 'kvkk_approve': {
					await this.services.cxperium.contact.updateGdprApprovalStatus(
						this.contact,
						true,
					);

					// Init EntryPoint.
					try {
						await initEntryPoint(this);
						await this.services.dialog.runWithIntentName(
							this,
							'CXPerium.Dialogs.Teams.WelcomeDialog',
						);
					} catch (error: any) {
						if (error?.message === 'end') {
							return;
						}
					}
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

		const heroCard = CardFactory.heroCard(
			await this.getLocalizationText('gdpr_question'),
			undefined,
			CardFactory.actions([
				{
					title: await this.getLocalizationText('approve'),
					value: 'kvkk_approve',
					type: ActionTypes.ImBack,
				},
				{
					title: await this.getLocalizationText('deny'),
					value: 'kvkk_red',
					type: ActionTypes.ImBack,
				},
			]),
		);

		const message = MessageFactory.attachment(heroCard);

		await this.context.sendActivity(message);
	}
}
