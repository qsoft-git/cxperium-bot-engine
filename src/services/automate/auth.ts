// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '../cxperium';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';

export default class extends ServiceCxperium {
	constructor(data: TCxperiumServiceParams) {
		super(data);
	}

	public async getAuthToken(this: any): Promise<string> {
		const env = await this.serviceCxperiumConfiguration.execute();
		const response = (await fetch(`${env.automateConfig.ApiUrl}/login`, {
			method: 'POST',
			body: JSON.stringify({
				ClientId: env.automateConfig.ClientId,
				ClientSecret: env.automateConfig.ClientSecret,
			}),
		}).then((response) => response.json())) as any;

		return response;
	}
}
