// ? Fetch Retry.
import fetchRetry from '../fetch';
import axios from 'axios';
import * as fs from 'fs';
import FormData from 'form-data';
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
		filepaths: string[],
	): Promise<string> {
		const formData = new FormData();
		formData.append('contactId', contactId);
		formData.append('message', message);
		formData.append('subject', subject);

		if (tags?.length > 0) {
			tags.forEach((tag) => {
				formData.append('tags', tag);
			});
		}

		if (filepaths != null && filepaths.length > 0) {
			for (const path of filepaths) {
				try {
					const stream = fs.createReadStream(path);
					formData.append('media', stream);
				} catch (error) {
					console.error('Dosya okuma hatası:', error);
					throw new Error('Dosya okuma hatası');
				}
			}
		}
		try {
			const response = await axios.post(
				`${this.baseUrl}/api/ticket`,
				formData,
				{
					headers: {
						apikey: this.apiKey,
						...formData.getHeaders(),
					},
				},
			);

			if (response.status === 201) {
				return response.data.data.ticket;
			} else {
				console.error(
					'Ticket oluşturulurken bir sorun oluştu:',
					response.data,
				);
				throw new Error('Ticket oluşturulurken bir sorun oluştu.');
			}
		} catch (error) {
			console.error('API isteği sırasında hata:', error);
			throw new Error('API isteği sırasında hata');
		}
	}

	async comment(
		lastAnswerId: string,
		phone: string,
		comment: string,
		filepaths: string[] | [],
	) {
		const formData = new FormData();
		formData.append('message', comment);

		if (filepaths && filepaths.length > 0) {
			filepaths.forEach((path) => {
				formData.append('files', fs.createReadStream(path));
			});
		}

		try {
			const response = await axios.post(
				`${this.baseUrl}/api/ticket/${lastAnswerId}/wa/${phone}/comments`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						apikey: this.apiKey,
						...formData.getHeaders(),
					},
				},
			);

			return response.data;
		} catch (error) {
			console.error('Hata oluştu:', error);
			throw new Error('Yorum eklenirken hata oluştu.');
		}
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
