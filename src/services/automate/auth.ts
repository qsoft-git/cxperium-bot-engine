// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '../cxperium';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';

// Services.
import ServiceCxperiumConfiguration from '../cxperium/configuration';

export default class extends ServiceCxperium {
	serviceCxperiumConfiguration!: ServiceCxperiumConfiguration;
	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.serviceCxperiumConfiguration = new ServiceCxperiumConfiguration(
			data,
		);
	}

	public async getAuthToken(): Promise<string> {
		const env = await this.serviceCxperiumConfiguration.execute();
		const body = {
			ClientId: env.automateConfig.ClientId,
			ClientSecret: env.automateConfig.ClientSecret,
		};

		const response = (await fetch(`${env.automateConfig.ApiUrl}/login`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then((response) => response.json())) as any;

		return response;
	}
}
