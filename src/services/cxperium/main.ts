// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '.';
import ServiceCxperiumContact from './contact';

// Interfaces.
import { ICxperiumParams } from '../../interfaces/services/cxperium';

export default class extends ServiceCxperium {
	constructor(data: ICxperiumParams) {
		super(data);
	}

	public get contact(): string {
		return 'keee' + this.apiKey;
	}

	public selam(): string {
		return 'selam' + this.callbackUrl;
	}

	// public static createContact(
	// 	phone: string,
	// 	email: string,
	// 	profileName: string,
	// 	attributes: object,
	// ): Promise<unknown> {
	// 	try {
	// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 		const body: Record<string, any> = {
	// 			phone: phone,
	// 			email: email,
	// 			profileName: profileName,
	// 		};

	// 		if (attributes) {
	// 			for (const [key, value] of Object.entries(attributes)) {
	// 				body['custom'][key] = value;
	// 			}
	// 		}

	// 		const response = await fetch(`${this.BASE_URL}"/api/contacts"`, {
	// 			method: 'post',
	// 			body: JSON.stringify(body),
	// 			headers: { 'Content-Type': 'application/json', 'apiKey':  API_KEY},
	// 		});

	// 		return response;
	// 	} catch (error) {}
	// }

	// async updateContactConversationDateByContactId(contactId: string) {
	// 	try {
	// 		const client = await axios();

	// 		const body = {
	// 			lastConversationDate: Date.now,
	// 		};

	// 		await client.put(`/api/contacts/${contactId}`, body);
	// 	} catch (error) {}
	// }

	// async getContactIdByPhone(phone: string): Promise<unknown> {
	// 	const client = await axios();
	// 	const response = await client.get(`/api/contacts/phone/${phone}`);
	// 	return response;
	// }

	// async getContactByContactId(contactId: string): Promise<Contact> {
	// 	const client = await axios();
	// 	const response = await client.get(`/api/contacts/${contactId}`);

	// 	if (response.status == 201) {
	// 		const contact: Contact = {
	// 			_id: response?.data?._id,
	// 			phone: response?.data?.phone,
	// 			email: response?.data?.email,
	// 			userProfileName: response?.data?.userProfileName,
	// 			createdAt: response?.data?.createdAt,
	// 			updatedAt: response?.data?.updatedAt,
	// 			user_id: response?.data?.user_id,
	// 			custom: response?.data?.custom,
	// 			tags: response?.data?.tags,
	// 			delete: response?.data?.delete,
	// 		};

	// 		return contact;
	// 	} else {
	// 		throw new Error(
	// 			`${contactId} number cannot be found in Cxperium contact list.`,
	// 		);
	// 	}
	// }

	// async anonymizeContact(phone: string) {
	// 	const client = await axios();

	// 	await client.patch(`/api/contacts/anonymize/${phone}`);
	// }

	// async deleteContact(phone: string) {
	// 	const client = await axios();

	// 	const body = {
	// 		delete: true,
	// 		phone: phone,
	// 	};

	// 	const response = await client.post('/api/contacts', body);

	// 	return response;
	// }

	// async getContactByPhone(phone: string): Promise<Contact> {
	// 	const client = await axios();

	// 	const response = await client.get(`/api/contacts/phone/${phone}`);

	// 	if (response.status == 201) {
	// 		return response.data.data;
	// 	} else {
	// 		throw new Error(
	// 			`${phone} number cannot be found in Cxperium contact list.`,
	// 		);
	// 	}
	// }

	// async updateContactEmail(contactId: string, email: string) {
	// 	const client = await axios();

	// 	const body = {
	// 		email: email,
	// 	};

	// 	await client.put(`/api/contacts/${contactId}`, body);
	// }

	// async updateContactByCustomFields(contact: Contact, attributes: object) {
	// 	const client = await axios();

	// 	const body: Record<string, any> = {};

	// 	if (attributes) {
	// 		for (const [key, value] of Object.entries(attributes)) {
	// 			body['custom'][key] = value;
	// 		}
	// 	}

	// 	await client.put(`/api/contacts/${contact._id}`, body);
	// }

	// async updateGdprApprovalStatus(contact: Contact, status: boolean) {
	// 	const client = await axios();

	// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 	const body: Record<string, any> = {};

	// 	body['custom']['isKvkkApproved'] = status;

	// 	await client.put(`/api/contacts/${contact._id}`, body);
	// }

	// async updateSurveyTransferStatus(contact: Contact, status: boolean) {
	// 	const client = await axios();

	// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 	const body: Record<string, any> = {};

	// 	body['custom']['isSurveyTransfer'] = status;

	// 	await client.put(`/api/contacts/${contact._id}`, body);
	// }

	// async updateLiveTransferStatus(contact: Contact, status: boolean) {
	// 	const client = await axios();

	// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 	const body: Record<string, any> = {};

	// 	body['custom']['isLiveTransfer'] = status;

	// 	await client.put(`/api/contacts/${contact._id}`, body);
	// }
}
