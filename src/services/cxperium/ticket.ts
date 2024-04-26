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

	async create(
		subject: string,
		contactId: string,
		message: string,
		tags: string[],
	): Promise<string> {
		const body: Record<string, unknown> = {
			contactId: contactId,
			message: message,
			subject: subject,
			tags: [],
		};

		if (tags && tags.length > 0) {
			body['tags'] = tags;
		}

		const response = (await fetch(`${this.baseUrl}/api/ticket`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
			body: JSON.stringify(body),
		}).then((response) => response.json())) as any;

		if (response.status == 201) {
			return response.data.ticket;
		}

		console.error(`${body} has a problem creating ticket.`);
		throw new Error('Problem occurred during creating ticket.');
	}

	async comment(ticketId: string, comment: string) {
		const body = {
			message: comment,
		};

		await fetch(
			`${this.baseUrl}/api/ticket/send-comment/phone/${ticketId}`,
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

	async getSubs() {
		return await fetch(`${this.baseUrl}/api/subuser`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}

	async assigneeTicketToSub(id: string, ticketId: string) {
		const response = (await fetch(
			`${this.baseUrl}/api/assignee-change/${ticketId}/SUB/${id}`,
			{
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		if (response.status == 201) {
			return true;
		}

		console.error('Operation has a problem with ticket assignment.');
		throw new Error('Problem occurred during with ticket assignment.');
	}
}
