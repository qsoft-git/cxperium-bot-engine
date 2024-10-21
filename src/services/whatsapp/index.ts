// ? Node modules
import axios from 'axios';

// ? Services.
import ServiceCxperiumConfiguration from '../cxperium/configuration';

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

		const response = (await fetch(`${url}/${endpoint}`, {
			method: 'POST',
			headers: {
				'Content-Type': contentType,
				'D360-API-KEY': env.whatsappConfig.key,
			},
			body,
		}).then((response) => response.json())) as any;

		if (response.meta.success === false) {
			throw response.meta.developer_message;
		}

		return response.media[0].id;
	}

	public async wpRequest(body: any, endpoint: string) {
		let response;

		const env = (await this.configuration.execute()) as any;

		if (env.whatsappConfig.provider == 'DIALOG360') {
			response = (await fetch(
				`${env.whatsappConfig.wabaUrl}/${endpoint}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'D360-API-KEY': env.whatsappConfig.key,
					},
					body: JSON.stringify(body),
				},
			).then((response) => response.json())) as any;
		} else if (env.whatsappConfig.provider == 'CLOUD') {
			const phoneNumberId = env?.whatsappConfig?.phoneNumberId;

			if (!phoneNumberId) {
				throw new Error('WhatsApp phone number not found!');
			}

			if (!env.whatsappConfig?.key) {
				throw new Error('WhatsApp key not found!');
			}

			const requestUrl = `https://graph.facebook.com/${
				process.env.VERSION || 'v19.0'
			}/${phoneNumberId}/messages`;
			const reviveBody = { ...body, messaging_product: 'whatsapp' };
			delete reviveBody?.recipient_type;

			response = (await fetch(requestUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + env.whatsappConfig.key,
				},
				body: JSON.stringify(reviveBody),
			}).then((response) => response.json())) as any;
		} else {
			throw new Error('WhatsApp configuration provider not found');
		}

		if (response?.meta?.success === false) {
			throw response?.meta?.developer_message;
		}

		return response;
	}
}
