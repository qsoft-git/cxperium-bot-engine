// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '.';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';

export default class extends ServiceCxperium {
	constructor(data: TCxperiumServiceParams) {
		super(data);
	}

	async assignChatToTeam(chatId: string, teamId: string) {
		await fetch(
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
		const response = (await fetch(`${this.baseUrl}/api/business-hours`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;
		if (response.data.featureEnabled) return response.data.status;
		else return true;
	}

	async getOutsideBusinessHoursMessage(cultureCode: string): Promise<string> {
		const response = (await fetch(`${this.baseUrl}/api/business-hours`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;

		return response.data.message.cultureCode;
	}

	async redirectWpMessage(message: object) {
		try {
			const response = await fetch('', {
				method: 'POST',
				body: JSON.stringify(message),
			});
		} catch (error) {
			throw new Error('');
		}
	}

	async sendNormalMessage(message: string, contactId: string) {
		const body = {
			message: message,
			contactId: contactId,
		};

		const response = (await fetch(`${this.baseUrl}/api/chat/send-message`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;

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

		await fetch(`${this.baseUrl}/api/chat/send-message/${chatId}`, {
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
		await fetch(`${this.baseUrl}/api/chat/send-message/phone/${chatId}`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		});
	}

	async sendWhatsappMessageOverload(
		chatId: string,
		message: string,
		phone: string,
		base64Content: string,
		filename: string,
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
					filename: filename,
					type: type,
				},
			},
		};

		await fetch(`${this.baseUrl}/api/chat/send-message/phone/${chatId}`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		});
	}
}
