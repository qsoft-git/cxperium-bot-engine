// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '.';
import ServiceCxperiumContact from './contact';
import ServiceCxperiumConversation from './conversation';

// Interfaces.
import { ICxperiumParams } from '../../interfaces/services/cxperium';

export default class extends ServiceCxperium {
	serviceCxperiumContact!: ServiceCxperiumContact;
	serviceCxperiumConversation!: ServiceCxperiumConversation;
	constructor(data: ICxperiumParams) {
		super(data);
		this.serviceCxperiumContact = new ServiceCxperiumContact(data);
		this.serviceCxperiumConversation = new ServiceCxperiumConversation(
			data,
		);
	}

	async createOrUpdateSession(
		isActive: boolean,
		language: string,
		phone: string,
		message: string,
	) {
		if (!language) language = 'TR';

		const body = {
			language: language,
			phone: phone,
			data: {
				message: message,
				isLast: true,
			},
			isActive: isActive,
		};

		await fetch(this.baseUrl + '/api/assistant/session', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apiKey: this.apiKey,
			},
		});

		await this.updateConversationSessionTime(phone);
	}

	async updateConversationSessionTime(phone: string) {
		const contact =
			await this.serviceCxperiumContact.getContactByPhone(phone);

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
				apiKey: this.apiKey,
			},
		}).then((response) => response.json())) as any;

		return response;
	}
}
