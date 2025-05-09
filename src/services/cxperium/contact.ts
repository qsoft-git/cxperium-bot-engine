// ? Fetch Retry.
import fetchRetry from '../fetch';

// ? Services.
import ServiceCxperium from '.';

// ? Types.
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
					if (!value) continue;
					body['custom'][key] = value;
				}
			}

			const response = (await fetchRetry(this.baseUrl + '/api/contacts', {
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
					tags: response?.data?.tags || [],
					delete: response?.data?.delete,
				};

				return contact;
			}
		} catch (error) {
			console.error('Error in createContact', error);
		}
	}

	private async updateContact(
		contact: TCxperiumContact,
		attributes: Partial<Record<keyof TCxperiumContact, unknown>>,
	): Promise<TCxperiumContact> {
		const body = { ...attributes };

		const response = (await fetchRetry(
			`${this.baseUrl}/api/contacts/${contact._id}`,
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

		return response?.data as TCxperiumContact;
	}

	async assignTagToContact(
		contact: TCxperiumContact,
		tagId: string,
	): Promise<TCxperiumContact | undefined> {
		const tag = contact.tags.some((t) => t.id === tagId);

		if (tag) {
			console.warn(`Tag ${tagId} is already assigned to contact.`);
			return contact;
		}

		const tags = [...contact.tags.map((tag) => tag.id), tagId];

		try {
			return await this.updateContact(contact, {
				tags,
			});
		} catch (error) {
			console.error('Error in assignTagToContact', error);
			return undefined;
		}
	}

	async unAssignTagFromContact(contact: TCxperiumContact, tagId: string) {
		const tag = contact.tags.some((t) => t.id === tagId);

		if (!tag) {
			throw new Error(`Tag ${tagId} is not assigned to contact.`);
		}

		const tags = contact.tags
			.map((tag) => tag.id)
			.filter((t) => t !== tagId);

		try {
			return await this.updateContact(contact, {
				tags,
			});
		} catch (error) {
			console.error('Error in assignTagToContact', error);
			return undefined;
		}
	}

	async updateContactConversationDateByContactId(contactId: string) {
		try {
			const date = new Date();

			const body = {
				lastConversationDate: date.toISOString(),
			};

			await fetchRetry(`${this.baseUrl}/api/contacts/${contactId}`, {
				method: 'PUT',
				body: JSON.stringify(body),
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			});
		} catch (error) {
			console.error(
				'Error in updateContactConversationdateByContactId',
				error,
			);
		}
	}

	async getContactIdByPhone(phone: string): Promise<unknown> {
		const response = (await fetchRetry(
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

	async getContactByContactId(contactId: string): Promise<TCxperiumContact> {
		const response = (await fetchRetry(
			`${this.baseUrl}/api/contacts/${contactId}`,
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		)
			.then((response) => response.json())
			.catch((error) => {
				console.log(error);
			})) as any;

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
		await fetchRetry(`${this.baseUrl}/api/contacts/anonymize/${phone}`, {
			method: 'patch',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		});
	}

	async getContactWithPhone(phone: string): Promise<TCxperiumContact> {
		const response = (await fetchRetry(
			`${this.baseUrl}/api/contacts/phone/${phone}`,
			{
				method: 'get',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		return response?.data;
	}

	async getContactByPhone(dialog: any): Promise<TCxperiumContact> {
		const phone = dialog.activity.from;

		const response = (await fetchRetry(
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
			let contact: TCxperiumContact = {
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
				language: response?.data?.language,
			};

			if (
				response?.data?.custom?.IsKvkkApproved?.length == 0 ||
				response.data?.custom?.IsCxLiveTransfer == null ||
				response.data?.custom?.IsCxTransfer == null
			) {
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

				await this.updateContactByCustomFields(contact, attributes);

				const result = (await fetchRetry(
					`${this.baseUrl}/api/contacts/phone/${phone}`,
					{
						method: 'get',
						headers: {
							'content-type': 'application/json',
							apikey: this.apiKey,
						},
					},
				).then((response) => response.json())) as any;

				contact = result?.data;
			}

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
				dialog.activity.userProfileName,
				attributes,
			);
		}
	}

	async updateContactEmail(contactId: string, email: string) {
		const body = {
			email: email,
		};

		(await fetchRetry(`${this.baseUrl}/api/contacts/${contactId}`, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;
	}

	async updateContactLanguage(contactId: string, language: string) {
		const body = {
			language: language,
		};

		(await fetchRetry(`${this.baseUrl}/api/contacts/${contactId}`, {
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
		const body: Record<string, any> = { custom: {} };

		if (attributes) {
			for (const [key, value] of Object.entries(attributes)) {
				body['custom'][key] = value;
			}
		}

		await fetchRetry(`${this.baseUrl}/api/contacts/${contact._id}`, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		});
	}

	async updateGdprApprovalStatus(contact: TCxperiumContact, status: boolean) {
		const body: Record<string, any> = {
			custom: {},
		};

		body['custom']['IsKvkkApproved'] = status;

		await fetchRetry(`${this.baseUrl}/api/contacts/${contact._id}`, {
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
		const body: Record<string, any> = {
			custom: {},
		};

		body['custom']['IsCxTransfer'] = status;

		await fetchRetry(`${this.baseUrl}/api/contacts/${contact._id}`, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}

	async updateLiveTransferStatus(contact: TCxperiumContact, status: boolean) {
		const body: Record<string, any> = {
			custom: {},
		};

		body['custom']['IsCxLiveTransfer'] = status;

		await fetchRetry(`${this.baseUrl}/api/contacts/${contact._id}`, {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json());
	}

	async checkOpenChat(contactId: string): Promise<boolean> {
		const result: any = await fetchRetry(
			`${this.baseUrl}/api/chat/active/${contactId}`,
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json());

		return Boolean(result.data);
	}
}
