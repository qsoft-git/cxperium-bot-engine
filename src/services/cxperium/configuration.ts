// ? Environment.
const { NODE_ENV, PROD_ENV } = process.env;

// ? Services.
import ServiceCxperium from '.';

// ? Fetch Retry.
import fetchRetry from '../fetch';

// ? Datas.
import DataGeneral from '../../data/general';

// ? Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';
import { TCxperiumEnvironment } from '../../types/configuration/environment';

// ? Utils.
import { TWhatsappConfig } from '../../types/configuration/whatsapp';
import { TChatGPTConfig } from '../../types/configuration/chatgpt';
import { TCxperiumLiveConfig } from '../../types/configuration/live';
import { TDialogflowConfig } from '../../types/configuration/dialogflow';
import { TGdprConfig } from '../../types/configuration/gdpr';
import { TEnterpriseChatGPTConfig } from '../../types/configuration/enterpriseChatGPT';
import { TSessionTimeoutConfig } from '../../types/configuration/sessionTimeout';

export default class extends ServiceCxperium {
	private cache = DataGeneral.cache;
	constructor(data: TCxperiumServiceParams) {
		super(data);
	}

	async execute(): Promise<TCxperiumEnvironment> {
		const envFromCache: TCxperiumEnvironment | undefined =
			this.cache.get('CXPERIUM_ENV');

		if (envFromCache) return envFromCache;

		const allEnv = (await this.getAllEnv()) as any;

		const whatsappConfig: TWhatsappConfig = allEnv.WhatsAppConfig;
		const chatgptConfig: TChatGPTConfig = allEnv.ChatGPTConfig;
		const liveConfig: TCxperiumLiveConfig = allEnv.CxperiumLiveConfig;
		const dialogflowConfig: TDialogflowConfig = allEnv.DialogFlowConfig;
		const enterpriseChatGPTConfig: TEnterpriseChatGPTConfig =
			allEnv.EnterpriseChatGptConfig;
		const gdprConfig: TGdprConfig = allEnv.GdprConfig;
		const sessionTimeoutConfig: TSessionTimeoutConfig =
			allEnv.SessionTimeoutConfig;
		const extraFields: Record<string, unknown> = {};

		for (const [k, v] of Object.entries(allEnv)) {
			if (
				k !== 'ChatGPTConfig' &&
				k !== 'CxperiumLiveConfig' &&
				k !== 'DialogFlowConfig' &&
				k !== 'GdprConfig'
			) {
				extraFields[k] = v;
			}
		}

		const env: TCxperiumEnvironment = {
			chatgptConfig: chatgptConfig,
			cxperiumLiveConfig: liveConfig,
			dialogflowConfig: dialogflowConfig,
			gdprConfig: gdprConfig,
			whatsappConfig: whatsappConfig,
			enterpriseChatgptConfig: enterpriseChatGPTConfig,
			sessionTimeoutConfig: sessionTimeoutConfig,
			extraFields: extraFields,
		};

		this.cache.set('CXPERIUM_ENV', env);
		return env;
	}

	private async getAllEnv() {
		const response = (await fetchRetry(
			`${this.baseUrl}/api/assistant/configuration`,
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		const result = response.data.data.data;
		result.WhatsAppConfig = await this.getWhatsappConfig();

		if (!result.ChatGPTConfig) {
			throw new Error(
				'ChatGPTConfig is required to continue to run this project',
			);
		}
		if (!result.EnterpriseChatGptConfig) {
			throw new Error(
				'Enterprise ChatGpt Config is required to continue to run this project',
			);
		}
		if (!result.GdprConfig) {
			throw new Error(
				'GdprConfig is required to continue to run this project',
			);
		}
		if (!result.CxperiumLiveConfig) {
			throw new Error(
				'CxperiumLiveConfig is required to continue to run this project',
			);
		}
		if (!result.DialogFlowConfig) {
			throw new Error(
				'Dialogflow config is required to continue to run this project',
			);
		}
		if (!result.WhatsAppConfig) {
			if (NODE_ENV === 'development')
				throw new Error(
					'WhatsappDevConfig is required to continue to run this project',
				);
			else
				throw new Error(
					'WhatsappConfig is required to continue to run this project',
				);
		}

		return result;
	}

	private async getWhatsappConfig(): Promise<TWhatsappConfig> {
		let response;
		let whatsappConfig: TWhatsappConfig;

		if (PROD_ENV === 'true' || NODE_ENV !== 'development') {
			const response = (await fetchRetry(`${this.baseUrl}/api/waba`, {
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			}).then((response) => response.json())) as any;

			whatsappConfig = {
				shoppingCatalogId: response.data.shoppingCatalogId,
				key: response.data.key,
				phone: response.data.phone,
				wabaUrl: response.data.wabaUrl,
				namespace: response.data.namespace,
				platform: response.data.platform,
				provider: response?.data?.providers || response?.data?.provider,
				businessAccountId: response?.data?.businessAccountId,
				phoneNumberId: response?.data?.phoneNumberId,
			};
		} else {
			response = (await fetchRetry(
				`${this.baseUrl}/api/assistant/whatsapp-config`,
				{
					method: 'GET',
					headers: {
						'content-type': 'application/json',
						apikey: this.apiKey,
					},
				},
			).then((response) => response.json())) as any;

			whatsappConfig = {
				shoppingCatalogId: response.data.shoppingCatalogId,
				key: response.data.key,
				phone: response.data.phone,
				wabaUrl: response.data.wabaUrl,
				namespace: response.data.namespace,
				platform: response.data.platform,
				provider: response?.data?.providers || response?.data?.provider,
				businessAccountId: response?.data?.businessAccountId,
				phoneNumberId: response?.data?.phoneNumberId,
			};
		}

		return whatsappConfig;
	}
}
