// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '.';

// Types.
import { TCxperiumContact } from '../../types/cxperium/contact';
import { TCxperiumServiceParams } from '../../types/cxperium/service';

export default class extends ServiceCxperium {
	constructor(data: TCxperiumServiceParams) {
		super(data);
	}

	async createContact(
		phone: string,
		email: string,
		profileName: string,
		attributes: object,
	): Promise<any> {
		try {
			const body: Record<string, any> = {
				phone: phone,
				email: email,
				userProfileName: profileName,
				custom: {},
			};

			if (attributes && Object.entries(attributes).length > 0) {
				for (const [key, value] of Object.entries(attributes)) {
					let val = value;
					if (val.length < 1) val = 'unknown';
					body['custom'][key] = val;
				}
			}

			const response = (await fetch(this.baseUrl + '/api/contacts', {
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'content-type': 'application/json',
					apiKey: this.apiKey,
				},
			}).then((response) => response.json())) as any;

			if (response.status == 201) {
				const contact: TCxperiumContact = {
					_id: response?.data?._id,
					phone: response?.data?.phone,
					email: response?.data?.email,
					userProfileName: response?.data?.userProfileName,
					createdAt: response?.data?.createdAt,
					updatedAt: response?.data?.updatedAt,
					user_id: response?.data?.user_id,
					custom: response?.data?.custom,
					tags: response?.data?.tags,
					delete: response?.data?.delete,
				};

				return contact;
			}
		} catch (error) {
			console.error(error);
		}
	}

	async updateContactConversationDateByContactId(contactId: string) {
		try {
			const body = {
				lastConversationDate: Date.now,
			};

			await fetch(`${this.baseUrl}/api/contacts/${contactId}`, {
				method: 'put',
				body: JSON.stringify(body),
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			}).then((response) => response.json());
		} catch (error) {
			console.error(error);
		}
	}

	async getContactIdByPhone(phone: string): Promise<unknown> {
		const response = (await fetch(
			`${this.baseUrl}/api/contacts/phone/${phone}`,
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;
		return response?.data?._id;
	}

	async getContactByContactId(contactId: string): Promise<unknown> {
		const response = (await fetch(
			`${this.baseUrl}/api/contacts/${contactId}`,
			{
				method: 'get',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		if (response.status == 201) {
			const contact: TCxperiumContact = {
				_id: response?.data?._id,
				phone: response?.data?.phone,
				email: response?.data?.email,
				userProfileName: response?.data?.userProfileName,
				createdAt: response?.data?.createdAt,
				updatedAt: response?.data?.updatedAt,
				user_id: response?.data?.user_id,
				custom: response?.data?.custom,
				tags: response?.data?.tags,
				delete: response?.data?.delete,
			};

			return contact;
		} else {
			throw new Error(
				`${contactId} number cannot be found in Cxperium contact list.`,
			);
		}
	}

	async anonymizeContact(phone: string) {
		await fetch(`${this.baseUrl}/api/contacts/anonymize/${phone}`, {
			method: 'patch',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		});
	}

	async getContactByPhone(
		phone: string,
		userProfileName: string,
	): Promise<TCxperiumContact> {
		const response = (await fetch(
			`${this.baseUrl}/api/contacts/phone/${phone}`,
			{
				method: 'get',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		if (response.status == 201 && response.data) {
			const contact: TCxperiumContact = {
				_id: response?.data?._id,
				phone: response?.data?.phone,
				email: response?.data?.email,
				userProfileName: response?.data?.userProfileName,
				createdAt: response?.data?.createdAt,
				updatedAt: response?.data?.updatedAt,
				user_id: response?.data?.user_id,
				custom: response?.data?.custom,
				tags: response?.data?.tags,
				delete: response?.data?.delete,
			};

			return contact;
		} else {
			const attributes: Record<string, unknown> = {
				FirstName: '',
				LastName: '',
				IsKvkkApproved: false,
				KvkkApprovalDate: '',
				KvkkNotApprovedDate: '',
				IsCxLiveTransfer: false,
				IsCxTransfer: false,
				ChatId: '',
			};

			return await this.createContact(
				phone,
				'',
				userProfileName,
				attributes,
			);
		}
	}

	async updateContactEmail(contactId: string, email: string) {
		const body = {
			email: email,
		};

		(await fetch(`${this.baseUrl}/api/contacts/${contactId}`, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;
	}

	async updateContactByCustomFields(
		contact: TCxperiumContact,
		attributes: object,
	) {
		const body: Record<string, any> = {};

		if (attributes) {
			for (const [key, value] of Object.entries(attributes)) {
				body['custom'][key] = value;
			}
		}

		await fetch(`${this.baseUrl}/api/contacts/${contact._id}`, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}

	async updateGdprApprovalStatus(contact: TCxperiumContact, status: boolean) {
		const body: Record<string, any> = {};

		body['custom']['isKvkkApproved'] = status;

		await fetch(`${this.baseUrl}/api/contacts/${contact._id}`, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}

	async updateSurveyTransferStatus(
		contact: TCxperiumContact,
		status: boolean,
	) {
		const body: Record<string, any> = {};

		body['custom']['isSurveyTransfer'] = status;

		await fetch(`${this.baseUrl}/api/contacts/${contact._id}`, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}

	async updateLiveTransferStatus(contact: TCxperiumContact, status: boolean) {
		const body: Record<string, any> = {};

		body['custom']['isLiveTransfer'] = status;

		await fetch(`${this.baseUrl}/api/contacts/${contact._id}`, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}
}
