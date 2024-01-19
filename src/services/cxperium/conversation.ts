// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '.';
import ServiceCxperiumContact from './contact';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';

export default class extends ServiceCxperium {
	serviceContactService!: ServiceCxperiumContact;
	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.serviceContactService = new ServiceCxperiumContact(data);
	}

	async chatExists(contactId: string) {
		const response = (await fetch(`${this.baseUrl}/api/chat`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;

		for (const o of response.data.data) {
			const sss = o.contactId;
			if (sss === contactId) return o['_id'];
		}

		return null;
	}

	async getContactIdByChatId(chatId: string) {
		const response = (await fetch(`${this.baseUrl}/api/chat`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;

		for (const o of response.data.data) {
			const sss = o._id;
			if (sss === chatId) return o.contactId;
		}

		return null;
	}

	async create(contactId: string) {
		const body = { contactId: contactId };
		const response = (await fetch(`${this.baseUrl}/api/chat`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;

		await this.serviceContactService.updateContactConversationDateByContactId(
			contactId,
		);

		return response.data.chat;
	}
}
