// ? Fetch Retry.
import fetchRetry from '../fetch';

// ? Services.
import ServiceCxperium from '.';
import ServiceCxperiumContact from './contact';

// ? Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';
import { TCxperiumContact } from '../../types/cxperium/contact';

export default class extends ServiceCxperium {
	serviceContactService!: ServiceCxperiumContact;
	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.serviceContactService = new ServiceCxperiumContact(data);
	}

	async chatExists(contactId: string) {
		const response = (await fetchRetry(`${this.baseUrl}/api/chat`, {
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

	async closeLiveChat(contact: TCxperiumContact): Promise<void> {
		const custom = contact.custom as any;
		await fetchRetry(
			`${this.baseUrl}/api/chat/status-change/${custom.ChatId}/CLOSED`,
			{
				method: 'PATCH',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json());
	}

	async getContactIdByChatId(chatId: string) {
		const response = (await fetchRetry(`${this.baseUrl}/api/chat`, {
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
		try {
			const body = { contactId: contactId };
			const response = (await fetchRetry(`${this.baseUrl}/api/chat`, {
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

			return response?.data?.chat;
		} catch (error: unknown) {
			console.error('Error in cxperium.conversation.create: ', error);
		}
	}
}
