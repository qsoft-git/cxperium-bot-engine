// Fetch Retry.
import fetchRetry from '../fetch';

// Datas.
import DataGeneral from '../../data/general';

// Services.
import ServiceCxperium from '.';
import ServiceCxperiumContact from './contact';
import ServiceCxperiumConversation from './conversation';
import ServiceCxperiumConfiguration from './configuration';
import ServiceCxperiumLanguage from './language';
import ServiceWhatsAppMessage from '../whatsapp/message';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';
import { TConversation } from '../../types/conversation';
import BaseConversation from '../conversation';

export default class extends ServiceCxperium {
	public cache: any;
	serviceCxperiumContact!: ServiceCxperiumContact;
	serviceCxperiumConversation!: ServiceCxperiumConversation;
	serviceCxperiumConfiguration!: ServiceCxperiumConfiguration;
	serviceCxperiumLanguage!: ServiceCxperiumLanguage;
	serviceWhatsAppMessage!: ServiceWhatsAppMessage;

	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.cache = DataGeneral.cache;
		this.serviceCxperiumContact = new ServiceCxperiumContact(data);
		this.serviceCxperiumConversation = new ServiceCxperiumConversation(
			data,
		);
		this.serviceCxperiumConfiguration = new ServiceCxperiumConfiguration(
			data,
		);
		this.serviceCxperiumLanguage = new ServiceCxperiumLanguage(data);
		this.serviceWhatsAppMessage = new ServiceWhatsAppMessage(
			this.serviceCxperiumConfiguration,
		);
	}

	async createOrUpdateSession(
		isActive: boolean,
		language: string,
		message: string,
		dialog: any,
	) {
		if (!language) {
			language = 'TR';
		}

		const phone = dialog.contact.phone;
		const body = {
			language: language,
			phone: phone,
			data: [
				{
					message: message,
					isLast: true,
				},
			],
			isActive: isActive,
		};

		(await fetchRetry(`${this.baseUrl}/api/assistant/session`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;

		await this.updateConversationSessionTime(dialog);
	}

	async updateConversationSessionTime(dialog: any) {
		const contact =
			await this.serviceCxperiumContact.getContactByPhone(dialog);

		if (contact)
			await this.serviceCxperiumContact.updateContactConversationDateByContactId(
				contact._id,
			);
	}

	async getAllActiveSessions() {
		const response = (await fetchRetry(
			this.baseUrl + '/api/assistant/session',
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		return response.data.filter((x: any) => x.isActive == true);
	}

	async getConversationWhatsapp(dialog: any) {
		const phone: string = dialog.contact.phone;

		let conversation: TConversation | undefined = this.cache.get(
			`CONVERSATION-${phone}`,
		);

		if (!conversation) {
			conversation = {
				languageId: 1,
				conversationData: [],
				waitData: {
					className: '',
					functionName: '',
				},
				sessionData: [],
				lastMessage: dialog.activity.text,
				cultureCode: 'TR',
				cache: {},
			};

			this.cache.set(`CONVERSATION-${phone}`, conversation);
		} else {
			const response = (await fetchRetry(
				`${this.baseUrl}/api/assistant/session/${phone}`,
				{
					method: 'GET',
					headers: {
						'content-type': 'application/json',
						apikey: this.apiKey,
					},
				},
			).then((response) => response.json())) as any;

			if (response.data.length > 0) {
				const lastMessage = response.data[0]?.data?.find(
					(message: any) => Boolean(message.isLast),
				)?.message;

				conversation = {
					languageId: 1,
					conversationData: conversation.conversationData,
					waitData: conversation.waitData,
					sessionData: response.data[0].data,
					lastMessage: lastMessage,
					cultureCode: 'TR',
					cache: conversation.cache,
				};

				this.cache.del(`CONVERSATION-${phone}`);
				this.cache.set(`CONVERSATION-${phone}`, conversation);
			}
		}

		return new BaseConversation(dialog, conversation);
	}

	async getConversationMicrosoft(dialog: any) {
		const id: string = dialog.activity.from.id;

		let conversation: TConversation | undefined = this.cache.get(
			`CONVERSATION-${id}`,
		);

		if (!conversation) {
			conversation = {
				languageId: 1,
				conversationData: [],
				waitData: {
					className: '',
					functionName: '',
				},
				sessionData: [],
				lastMessage: '',
				cultureCode: 'TR',
				cache: {},
			};

			this.cache.set(`CONVERSATION-${id}`, conversation);
		}

		return new BaseConversation(dialog, conversation);
	}

	private async closeSession(
		phone: string,
		language: string,
		message: string,
	): Promise<void> {
		const body = {
			language,
			phone,
			data: [
				{
					message: message,
					isLast: true,
				},
			],
			isActive: false,
		};

		await fetchRetry(`${this.baseUrl}/api/assistant/session`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		});
	}

	async closeActiveSessions() {
		const sessions = await this.getAllActiveSessions();

		sessions.forEach(async (session: any) => {
			await this.closeSession(session.phone, session.language, '');
		});
	}

	async closeActiveSessionsWithTransfer() {
		const sessionTimeout = Number(
			(await this.serviceCxperiumConfiguration.execute())
				.sessionTimeoutConfig.Minutes,
		);
		const activeSessions = await this.getAllActiveSessions();

		if (!activeSessions || activeSessions.length === 0) {
			return;
		}

		const date = Date.now();
		const languageMap: { [key: string]: number } = {
			TR: 1,
			EN: 2,
			AR: 3,
			RU: 4,
			DE: 5,
		};

		await Promise.all(
			activeSessions.map(async (session: any) => {
				const parsedUpdatedAt = new Date(session.updatedAt).getTime();
				const updateDifference = (date - parsedUpdatedAt) / (1000 * 60);

				if (updateDifference < sessionTimeout) {
					return;
				}

				const languageId = languageMap[session.language.toUpperCase()];

				if (!languageId) {
					throw new Error(
						`${session.language.toUpperCase()} is not available to send messages. Please implement necessary language to continue without error!`,
					);
				}

				console.log(
					`${session.phone} user has active session to be closed! Last updated on ${session.updatedAt}, will be ended on ${date}`,
				);

				const [message, contact] = await Promise.all([
					this.serviceCxperiumLanguage.getLanguageByKey(
						languageId,
						'SessionTimeoutMessage',
					),
					this.serviceCxperiumContact.getContactWithPhone(
						session.phone,
					),
				]);

				this.cache.del(`CONVERSATION-${contact.phone}`);

				const hasOpenChat =
					await this.serviceCxperiumContact.checkOpenChat(
						String(contact._id),
					);

				if (hasOpenChat) {
					console.log(
						`${session.phone} user has active live support chat. Closing now!`,
					);

					await Promise.all([
						this.serviceCxperiumConversation.closeLiveChat(contact),
						this.serviceCxperiumContact.updateLiveTransferStatus(
							contact,
							false,
						),
					]);
				} else {
					if (updateDifference < sessionTimeout * 2)
						await this.serviceWhatsAppMessage.sendRegularMessage(
							session.phone,
							message,
						);
				}

				console.log(`Closing ${session.phone} user's session!`);

				await Promise.all([
					this.closeSession(
						session.phone,
						session.language,
						'SESSION_CLOSED',
					),
					this.serviceCxperiumContact.updateSurveyTransferStatus(
						contact,
						false,
					),
				]);

				console.log(`${session.phone} user's session is closed!`);
			}),
		);
	}
}
