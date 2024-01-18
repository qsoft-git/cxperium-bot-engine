// Node modules.
import {
	ActionTypes,
	CardFactory,
	MessageFactory,
	TurnContext,
} from 'botbuilder';
import * as ACData from 'adaptivecards-templating';

// Types.
import { TActivity } from '../../types/whatsapp/activity';
import { TCxperiumContact } from '../../types/cxperium/contact';
import {
	TAppLocalsServices,
	TBaseDialogCtor,
	TBaseDialogDialogFileParams,
} from '../../types/base-dialog';

// Services.
import BaseConversation from '../conversation';

export default class {
	contact: TCxperiumContact;
	activity: TActivity;
	conversation: BaseConversation;
	services: TAppLocalsServices;
	dialogFileParams: TBaseDialogDialogFileParams;
	context: TurnContext;

	constructor(data: TBaseDialogCtor) {
		this.activity = data.activity;
		this.contact = data.contact;
		this.conversation = data.conversation;
		this.services = data.services;
		this.dialogFileParams = data.dialogFileParams;
		this.context = data.context;
	}

	public async sendMessage(message: string) {
		await this.context.sendActivity(message);
	}

	public async sendHeroCard() {
		const heroCard = CardFactory.heroCard(
			'title',
			undefined,
			CardFactory.actions([
				{
					title: 'Test title',
					value: 'Test Value',
					type: ActionTypes.MessageBack,
				},
			]),
		);

		const message = MessageFactory.attachment(heroCard);

		await this.context.sendActivity(message);
	}

	public async sendAdaptiveCard(payload: object, data: object | null) {
		const adaptiveCard = CardFactory.adaptiveCard(payload);

		if (data) {
			const context: ACData.IEvaluationContext = {
				$root: {
					title: 'test-deneme-birki',
				},
			};

			// for (const [k, v] of Object.entries(data)) {
			// 	templateData.$root[k] = v;
			// }

			const template = new ACData.Template(payload);
			const card = template.expand(context);

			await this.context.sendActivity({
				text: '',
				attachments: [CardFactory.adaptiveCard(card)],
			});
		}

		await this.context.sendActivity({
			text: '',
			attachments: [adaptiveCard],
		});
	}

	public async getLocalizationText(key: string) {
		const localization =
			await this.services.cxperium.language.getLanguageByKey(
				this.conversation.conversation.languageId,
				key,
			);

		return localization;
	}
}
