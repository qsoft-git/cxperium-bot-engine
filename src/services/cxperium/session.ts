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
		else if (activity?.value) return activity?.value?.text;
		else if (activity?.value?.payload) return activity?.value?.payload;
		else return 'flow_received';
	}

	async getConversation(dialog: any) {
		const phone: string = dialog.contact.phone;
		const message: string = await this.activityToText(dialog.activity);

		let conversation: TConversation | undefined = this.cache.get(
			`CONVERSATION-${phone}`,
		);

		if (!conversation) {
			conversation = {
				languageId: 1,
				conversationData: [],
				waitData: {
					className: '',
					functionName: '',
				},
				sessionData: [],
				lastMessage: message,
				cultureCode: 'TR',
				cache: {},
			};

			this.cache.set(`CONVERSATION-${phone}`, conversation);
		} else {
			conversation = {
				languageId: 1,
				conversationData: conversation.conversationData,
				waitData: conversation.waitData,
				sessionData: [],
				lastMessage: message,
				cultureCode: 'TR',
				cache: conversation.cache,
			};

			this.cache.del(`CONVERSATION-${phone}`);
			this.cache.set(`CONVERSATION-${phone}`, conversation);
		}

		return new BaseConversation(dialog, conversation);
	}
}
