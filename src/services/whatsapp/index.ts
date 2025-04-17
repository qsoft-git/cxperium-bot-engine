// ? Node modules
import axios from 'axios';

// ? Services.
import ServiceCxperiumConfiguration from '../cxperium/configuration';
import { getConfig } from './config';
import { cloudProvider, dialog360Provider } from './providers';

export default class {
	private CONFIGURATION: ServiceCxperiumConfiguration;

	constructor(serviceCxperiumConfiguration: ServiceCxperiumConfiguration) {
		this.CONFIGURATION = serviceCxperiumConfiguration;
	}

	public get configuration(): ServiceCxperiumConfiguration {
		return this.CONFIGURATION;
	}

	public async getFileRequest(fileId: string, contentType: string) {
		const env = (await this.configuration.execute()) as any;
		const url = env.whatsappConfig.wabaUrl;

		let response: ArrayBuffer;
		if (env.whatsappConfig.provider === 'DIALOG360') {
			response = (await fetch(`${url}/v1/media/${fileId}`, {
				method: 'GET',
				headers: {
					'Content-Type': contentType,
					'D360-API-KEY': env.whatsappConfig.key,
				},
			}).then((response) => response.arrayBuffer())) as any;
		} else if (env.whatsappConfig.provider === 'CLOUD') {
			const phoneNumberId = env?.whatsappConfig?.phoneNumberId;

			if (!phoneNumberId) {
				throw new Error('WhatsApp phone number not found!');
			}

			if (!env.whatsappConfig?.key) {
				throw new Error('WhatsApp key not found!');
			}

			const imageResp = (await fetch(
				`https://graph.facebook.com/${
					process.env.VERSION || 'v19.0'
				}/${fileId}?phone_number_id=${phoneNumberId}`,
				{
					method: 'GET',
					headers: {
						Authorization: 'Bearer ' + env.whatsappConfig.key,
					},
				},
			).then((response) => response.json())) as any;

			response = (
				await axios.get(`${imageResp.url}`, {
					responseType: 'arraybuffer',
					headers: {
						Authorization: `Bearer ${env.whatsappConfig.key}`,
					},
				})
			).data as any;
		} else {
			throw new Error('WhatsApp configuration provider not found');
		}

		return response;
	}

	public async uploadFileRequest(
		body: Buffer,
		contentType: string,
		endpoint: string,
	) {
		const env = await this.configuration.execute();
		const url = env.whatsappConfig.wabaUrl;

		const uint8Array = new Uint8Array(body);

		const response = (await fetch(`${url}/${endpoint}`, {
			method: 'POST',
			headers: {
				'Content-Type': contentType,
				'D360-API-KEY': env.whatsappConfig.key,
			},
			body: uint8Array,
		}).then((response) => response.json())) as any;

		if (response.meta.success === false) {
			throw response.meta.developer_message;
		}

		return response.media[0].id;
	}

	public async wpRequest(body: any, endpoint: string): Promise<string> {
		const env = await getConfig(this.CONFIGURATION);

		const providerMap: { [key: string]: any } = {
			DIALOG360: dialog360Provider,
			CLOUD: cloudProvider,
		};

		const providerFunction = providerMap[env.whatsappConfig.provider];

		if (!providerFunction) {
			throw new Error('WhatsApp configuration provider not found');
		}

		try {
			return await providerFunction(body, endpoint, env.whatsappConfig);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error('Error Detail in wpRequest :', error);
				console.error('Error in wpRequest:', error.message);
				console.log("Your message couldn't be sent to Meta! 🚫");
			} else {
				console.error('Unknown error in wpRequest:', error);
			}

			return (
				'I encountered an error while sending a message. Error message :' +
				error
			);
		}
	}
}
