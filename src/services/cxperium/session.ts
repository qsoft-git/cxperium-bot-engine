// ? Fetch Retry.
import fetchRetry from '../fetch';

// ? Datas.
import DataGeneral from '../../data/general';

// ? Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';
import { TConversation } from '../../types/conversation';
import BaseConversation from '../conversation';
import { TCxperiumContact } from '../../types/cxperium/contact';
import { TActivity } from '../../types/whatsapp/activity';
import { Dialog } from '../../types/dialog';

// ? Services.
import ServiceCxperium from '.';
import ServiceCxperiumContact from './contact';
import ServiceCxperiumConfiguration from './configuration';
import ServiceCxperiumLanguage from './language';
import ServiceWhatsAppMessage from '../whatsapp/message';

export default class extends ServiceCxperium {
	public cache: any;
	serviceCxperiumContact!: ServiceCxperiumContact;
	serviceCxperiumConfiguration!: ServiceCxperiumConfiguration;
	serviceCxperiumLanguage!: ServiceCxperiumLanguage;
	serviceWhatsAppMessage!: ServiceWhatsAppMessage;

	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.cache = DataGeneral.cache;
		this.serviceCxperiumContact = new ServiceCxperiumContact(data);
		this.serviceCxperiumConfiguration = new ServiceCxperiumConfiguration(
			data,
		);
		this.serviceCxperiumLanguage = new ServiceCxperiumLanguage(data);
		this.serviceWhatsAppMessage = new ServiceWhatsAppMessage(
			this.serviceCxperiumConfiguration,
		);
	}

	async updateLastMessageTime(dialog: Dialog) {
		await this.updateConversationSessionTime(dialog);
	}

	async updateConversationSessionTime(dialog: Dialog) {
		const contact = dialog.contact as TCxperiumContact;

		await this.serviceCxperiumContact.updateContactConversationDateByContactId(
			contact._id,
		);
	}

	async getAllActiveSessions() {
		const response = (await fetchRetry(
			this.baseUrl + '/api/assistant/session',
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		return response.data.filter((x: any) => x.isActive == true);
	}

	private async activityToText(activity: TActivity): Promise<string> {
		if (activity?.text) return activity?.text;
		else if (activity?.reaction?.emoji.length > 0) return activity?.reaction?.emoji;
		else if (activity?.reply?.text.length > 0) return activity?.reply?.text;
		else if (activity?.value) return activity?.value?.text;
		else if (activity?.value?.payload) return activity?.value?.payload;
		else return 'flow_received';
	}

	private async getReactionContextId(activity: TActivity): Promise<string> {
		if (activity?.reaction?.message_id) return activity?.reaction?.message_id;
		else if (activity?.reply?.message_id.length > 0) return activity?.reply?.message_id;
		else return '';
	}

	async getConversation(dialog: any) {
		const phone: string = dialog.contact.phone;
		const message: string = await this.activityToText(dialog.activity);
		const contextId: string = await this.getReactionContextId(dialog.activity);

		let conversation: TConversation | undefined = this.cache.get(
			`CONVERSATION-${phone}`,
		);

		if (!conversation) {
			conversation = {
				languageId: this.resolveLanguageId(dialog?.contact),
				conversationData: [],
				waitData: {
					className: '',
					functionName: '',
				},
				messageType: dialog.activity.type,
				sessionData: [],
				contextId: contextId,
				lastMessage: message,
				cultureCode: 'TR',
				cache: {},
			};

			this.cache.set(`CONVERSATION-${phone}`, conversation);
		} else {
			conversation = {
				languageId: this.resolveLanguageId(dialog?.contact),
				conversationData: conversation.conversationData,
				waitData: conversation.waitData,
				sessionData: [],
				lastMessage: message,
				contextId: contextId,
				messageType: dialog.activity.type,
				cultureCode: conversation.cultureCode,
				cache: conversation.cache,
			};

			this.cache.del(`CONVERSATION-${phone}`);
			this.cache.set(`CONVERSATION-${phone}`, conversation);
		}

		return new BaseConversation(dialog, conversation);
	}

	private resolveLanguageId(contact: TCxperiumContact): number {
		if (!contact.language) {
			return 1;
		}

		if (
			Number.isInteger(contact.language) ||
			!isNaN(parseFloat(contact.language))
		) {
			return Number(contact.language);
		} else {
			const languageMapping = {
				TR: 1,
				EN: 2,
				AR: 3,
				GER: 4,
				RU: 5,
			};

			return languageMapping[
				contact.language as keyof typeof languageMapping
			]
				? languageMapping[
				contact.language as keyof typeof languageMapping
				]
				: 1;
		}
	}
}
