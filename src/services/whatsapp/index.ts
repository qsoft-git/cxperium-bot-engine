// Types.
import ServiceCxperiumConfiguration from '../cxperium/configuration';

export default class {
	private CONFIGURATION: ServiceCxperiumConfiguration;

	constructor(serviceCxperiumConfiguration: ServiceCxperiumConfiguration) {
		this.CONFIGURATION = serviceCxperiumConfiguration;
	}

	public get configuration(): ServiceCxperiumConfiguration {
		return this.CONFIGURATION;
	}

	public async uploadFileRequest(
		body: Buffer,
		contentType: string,
		endpoint: string,
	) {
		const response = (await fetch(
			`${
				(await this.configuration.execute()).whatsappConfig.whatsappUrl
			}/${endpoint}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': contentType,
					'D360-API-KEY': (await this.configuration.execute())
						.whatsappConfig.key,
				},
				body,
			},
		).then((response) => response.json())) as any;

		if (response.meta.success === false) {
			throw response.meta.developer_message;
		}

		return response.media[0].id;
	}

	public async wpRequest(
		body: string | Record<string, unknown>,
		contentType: string,
		endpoint: string,
	) {
		if (typeof body === 'object') body = JSON.stringify(body);

		const response = (await fetch(
			`${
				(await this.configuration.execute()).whatsappConfig.whatsappUrl
			}/${endpoint}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': contentType,
					'D360-API-KEY': (await this.configuration.execute())
						.whatsappConfig.key,
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
