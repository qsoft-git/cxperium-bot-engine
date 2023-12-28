// Modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '.';

// Interfaces.
import { ICxperiumParams } from '../../interfaces/services/cxperium';

export default class extends ServiceCxperium {
	constructor(data: ICxperiumParams) {
		super(data);
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

		// await updateConversationSessionTime(phone);
	}

	// async updateConversationSessionTime(phone: string) {
	// 	const contact = await getContactByPhone(phone);

	// 	if (contact)
	// 		await updateContactConversationDateByContactId(contact._id);
	// }

	// async getAllActiveSessions() {
	// 	const client = await axios();
	// 	const response = client.get('/api/assistant/session');
	// 	return response;
	// }
}
