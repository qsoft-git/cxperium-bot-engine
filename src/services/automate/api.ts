// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '../cxperium';
import ServiceCxperiumConfiguration from '../cxperium/configuration';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';

export default class extends ServiceCxperium {
	serviceCxperiumConfiguration!: ServiceCxperiumConfiguration;
	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.serviceCxperiumConfiguration = new ServiceCxperiumConfiguration(
			data,
		);
	}

	public async post(
		hypeUrl: string,
		data: Record<string, unknown>,
	): Promise<any> {
		const env = await this.serviceCxperiumConfiguration.execute();
		const url = `${env.automateConfig.HypeUrl}/webhook/${hypeUrl}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(data),
		}).then((response) => response.json());

		return response;
	}

	public async get(hypeUrl: string): Promise<any> {
		const env = await this.serviceCxperiumConfiguration.execute();
		const url = `${env.automateConfig.HypeUrl}/webhook/${hypeUrl}`;

		const response = await fetch(url, {
			method: 'GET',
		}).then((response) => response.json());

		return response;
	}
}
