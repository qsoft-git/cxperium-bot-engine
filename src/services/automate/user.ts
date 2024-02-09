// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '../cxperium';
import ServiceCxperiumConfiguration from '../cxperium/configuration';
import ServiceAutomateAuth from '../automate/auth';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';
import { User } from '../../types/automate/user';

export default class extends ServiceCxperium {
	serviceCxperiumConfiguration!: ServiceCxperiumConfiguration;
	private serviceAutomateAuth!: ServiceAutomateAuth;
	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.serviceCxperiumConfiguration = new ServiceCxperiumConfiguration(
			data,
		);
		this.serviceAutomateAuth = new ServiceAutomateAuth(data);
	}

	public async getUserSkills(userId: string) {
		const token =
			'Bearer ' + (await this.serviceAutomateAuth.getAuthToken());
		const env = await this.serviceCxperiumConfiguration.execute();

		const response = (await fetch(
			`${env.automateConfig.ApiUrl}/user/sub/${userId}/auth`,
			{
				method: 'GET',
				headers: {
					Authorization: token,
				},
			},
		).then((response) => response.json())) as any;

		return response;
	}

	public async getUserByPhone(phone: string): Promise<User> {
		if (!phone.startsWith('+')) phone = '+' + phone;

		const t = await this.serviceAutomateAuth.getAuthToken();
		const token = 'Bearer ' + t;
		const env = await this.serviceCxperiumConfiguration.execute();

		const response = (await fetch(
			`${env.automateConfig.ApiUrl}/user/sub/phone/${phone}`,
			{
				method: 'GET',
				headers: {
					Authorization: token,
				},
			},
		).then((response) => response.json())) as any;

		return response;
	}
}
