// Services.
import { FieldType } from 'botbuilder';
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
		const env = await this.configuration.execute();
		const url = env.whatsappConfig.wabaUrl.replace('-sandbox', '');

		const response = (await fetch(`${url}/v1/media/${fileId}`, {
			method: 'GET',
			headers: {
				'Content-Type': contentType,
				'D360-API-KEY': env.whatsappConfig.key,
			},
		}).then((response) => response.arrayBuffer())) as any;

		return response;
	}

	public async uploadFileRequest(
		body: Buffer,
		contentType: string,
		endpoint: string,
	) {
		const env = await this.configuration.execute();
		const url = env.whatsappConfig.wabaUrl.replace('-sandbox', '');

		const response = (await fetch(`${url}/${endpoint}`, {
			method: 'POST',
			headers: {
				'Content-Type': contentType,
				'D360-API-KEY': (await this.configuration.execute())
					.whatsappConfig.key,
			},
			body,
		}).then((response) => response.json())) as any;

		if (response.meta.success === false) {
			throw response.meta.developer_message;
		}

		return response.media[0].id;
	}

	public async wpRequest(
		body: string | Record<string, unknown>,
		endpoint: string,
	) {
		if (typeof body === 'object') body = JSON.stringify(body);

		const env = await this.configuration.execute();

		const response = (await fetch(
			`${(
				await this.configuration.execute()
			).whatsappConfig.wabaUrl.replace('-sandbox', '')}/${endpoint}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'D360-API-KEY': env.whatsappConfig.key,
				},
				body,
			},
		).then((response) => response.json())) as any;

		if (response.meta.success === false) {
			throw response.meta.developer_message;
		}

		return response;
	}
}
