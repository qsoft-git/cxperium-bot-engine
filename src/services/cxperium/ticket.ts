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

		const response = (await fetchRetry(`${this.baseUrl}/api/ticket`, {
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

		return await fetchRetry(
			`${this.baseUrl}/api/ticket/${ticketId}/wa/comments`,
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
		return await fetchRetry(`${this.baseUrl}/api/subuser`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}

	async getSubsWithAssigneeCount() {
		return await fetchRetry(`${this.baseUrl}/api/ticket/assignee-count`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}

	async lastAnswer(ticketId: string) {
		return await fetchRetry(`${this.baseUrl}/api/last-answer/${ticketId}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}

	async getAll(params: any = {}) {
		let url = `${this.baseUrl}/api/ticket`;
		let strifyParams = '?';

		if (Object.keys(params).length > 0) {
			const entriesParams = Object.entries(params);

			for (let i = 0; i < entriesParams.length; i++) {
				const [key, value] = entriesParams[i];
				const lastItem = i == entriesParams.length - 1;

				if (value instanceof Object) {
					strifyParams += `${key}=${JSON.stringify(value)}&`;
				} else {
					strifyParams += `${key}=${value}&`;
				}

				if (lastItem) {
					strifyParams = strifyParams.slice(0, -1);
				}
			}

			url += strifyParams;
		}

		return await fetchRetry(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}

	async getTicketById(ticketId: string) {
		return await fetchRetry(`${this.baseUrl}/api/ticket/${ticketId}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}

	async getTicketByTask(taskId: string) {
		return await fetchRetry(`${this.baseUrl}/api/ticket/task/${taskId}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}

	async messageIdWithGetTicketId(messageId: string) {
		return await fetchRetry(
			`${this.baseUrl}/api/last-answer-get/${messageId}`,
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json());
	}

	async assigneeTicketToSub(id: string, ticketId: string) {
		const response = (await fetchRetry(
			`${this.baseUrl}/api/assignee-change/${ticketId}/SUB/${id}`,
			{
				method: 'PATCH',
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
