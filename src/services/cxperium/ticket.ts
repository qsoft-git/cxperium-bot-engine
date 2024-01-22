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
		};

		if (tags && tags.length > 0) {
			body['tags'] = tags;
		}

		const response = (await fetch(this.baseUrl + '/api/ticket', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json)) as any;

		if (response.status == 201) {
			return response.data.data.ticketId;
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
		);
	}
}
