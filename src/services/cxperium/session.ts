// Node modules.
import fetch from 'node-fetch';

// Datas.
import DataGeneral from '../../data/general';

// Services.
import ServiceCxperium from '.';
import ServiceCxperiumContact from './contact';
import ServiceCxperiumConversation from './conversation';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';
import { TConversation } from '../../types/conversation';
import BaseConversation from '../conversation';

export default class extends ServiceCxperium {
	public cache: any;
	serviceCxperiumContact!: ServiceCxperiumContact;
	serviceCxperiumConversation!: ServiceCxperiumConversation;

	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.cache = DataGeneral.cache;
		this.serviceCxperiumContact = new ServiceCxperiumContact(data);
		this.serviceCxperiumConversation = new ServiceCxperiumConversation(
			data,
		);
	}

	async createOrUpdateSession(
		isActive: boolean,
		language: string,
		message: string,
		dialog: any,
	) {
		if (!language) language = 'TR';

		const phone = dialog.contact.phone;
		const body = {
			language: language,
			phone: phone,
			data: [
				{
					message: message,
					isLast: true,
				},
			],
			isActive: isActive,
		};

		(await fetch(`${this.baseUrl}/api/assistant/session`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;

		await this.updateConversationSessionTime(dialog);
	}

	async updateConversationSessionTime(dialog: any) {
		const contact =
			await this.serviceCxperiumContact.getContactByPhone(dialog);

		if (contact)
			await this.serviceCxperiumContact.updateContactConversationDateByContactId(
				contact._id,
			);
	}

	async getAllActiveSessions() {
		const response = (await fetch(this.baseUrl + '/api/assistant/session', {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;

		return response;
	}

	async getConversation(dialog: any) {
		const phone: string = dialog.contact.phone;

		const response = (await fetch(
			`${this.baseUrl}/api/assistant/session/${phone}`,
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		let lastMessage;

		for (const message of response?.data[0]?.data) {
			if (Boolean(message.isLast)) {
				lastMessage = message.message;
				break;
			}
		}

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
				faultCount: 0,
				sessionData: response.data[0].data,
				lastMessage: lastMessage,
				cultureCode: 'TR',
			};

			this.cache.set(`CONVERSATION-${phone}`, conversation);
		}

		return new BaseConversation(dialog, conversation);
	}
}
