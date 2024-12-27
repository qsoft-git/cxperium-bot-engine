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

	private async assignTagsToChat(
		chatId: string,
		tags: string[],
	): Promise<void> {
		const body = { tags };

		const response = (await fetchRetry(
			`${this.baseUrl}/api/chat/${chatId}/tags`,
			{
				method: 'PUT',
				body: JSON.stringify(body),
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		if (!response?.success) {
			throw new Error(`Error in updateContact: ${response.message}`);
		}
	}

	private async listAllChats() {
		try {
			const response = (await fetchRetry(`${this.baseUrl}/api/chat`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			}).then((response) => response.json())) as any;

			return response.data.data;
		} catch (error) {
			console.error(
				'Error in cxperium.conversation.listAllChats: ',
				error,
			);
			return [];
		}
	}

	async assingTagToChat(chatId: string, tagId: string): Promise<void> {
		try {
			const chats = await this.listAllChats();
			const chat = chats.find((c: any) => c._id === chatId);

			if (!chat) {
				console.warn(`Chat is not found with the id ${chatId}`);
				return;
			}

			const tags = chat.tags || [];

			if (tags.includes(tagId)) {
				console.warn('Tag is already assigned to chat.');
				return;
			}

			tags.push(tagId);

			await this.assignTagsToChat(chatId, tags);

			console.log(`Tag ${tagId} assigned to chat ${chatId}.`);
		} catch (error) {
			console.error(
				'Error in cxperium.conversation.assingTagToChat: ',
				error,
			);
		}
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
