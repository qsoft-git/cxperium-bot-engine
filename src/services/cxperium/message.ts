// ? Fetch Retry.
import fetchRetry from '../fetch';

// ? Services.
import ServiceCxperium from '.';

// ? Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';

export default class extends ServiceCxperium {
	constructor(data: TCxperiumServiceParams) {
		super(data);
	}

	async assignChatToTeam(chatId: string, teamId: string) {
		await fetchRetry(
			`${this.baseUrl}/api/chat/team-change/${chatId}/${teamId}`,
			{
				method: 'PATCH',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		);
	}

	async checkBusinessHour(): Promise<boolean> {
		const response = (await fetchRetry(
			`${this.baseUrl}/api/business-hours`,
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;
		if (!response.data.featureEnabled) {
			return false;
		}

		// if status is true, business hour feature means available. If customer message during business hours
		// then, will get support from live representative.
		return response.data.status;
	}

	async getOutsideBusinessHoursMessage(cultureCode: string): Promise<string> {
		let response: any;
		try {
			response = (await fetchRetry(`${this.baseUrl}/api/business-hours`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			}).then((response) => response.json())) as any;

			return response.data?.message[cultureCode];
		} catch (error: unknown) {
			return response?.data?.message;
		}
	}

	async redirectWpMessage(message: object) {
		await fetchRetry(this.callbackUrl, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(message),
		});
	}

	async sendNormalMessage(message: string, contactId: string) {
		const body = {
			message: message,
			contactId: contactId,
		};

		const response = (await fetchRetry(
			`${this.baseUrl}/api/chat/send-message`,
			{
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		return response.data;
	}

	async sendMessageWithChatId(
		chatId: string,
		message: string,
		contactId: string,
	) {
		const body = {
			message: message,
			contactId: contactId,
		};

		await fetchRetry(`${this.baseUrl}/api/chat/send-message/${chatId}`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
			},
		});
	}

	async sendWhatsappMessage(chatId: string, message: string, phone: string) {
		const body = {
			phone: phone,
			message: {
				text: message,
			},
		};
		await fetchRetry(
			`${this.baseUrl}/api/chat/send-message/phone/${chatId}`,
			{
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		);
	}

	async sendWhatsappMessageWithFile(
		chatId: string,
		message: string,
		phone: string,
		base64Content: string,
		type: string,
	) {
		const body = {
			message: {
				text: message,
			},
			phone: phone,
			media: {
				data: {
					url: base64Content,
					type: type,
				},
			},
		};

		return await fetchRetry(
			`${this.baseUrl}/api/chat/send-message/phone/${chatId}`,
			{
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json());
	}
}
