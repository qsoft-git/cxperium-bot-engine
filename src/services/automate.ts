// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '../services/cxperium';
import ServiceCxperiumConfiguration from '../services/cxperium/configuration';

// Types.
import { TCxperiumServiceParams } from '../types/cxperium/service';
import { User } from '../types/automate/user';

export default class extends ServiceCxperium {
	serviceCxperiumConfiguration!: ServiceCxperiumConfiguration;
	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.serviceCxperiumConfiguration = new ServiceCxperiumConfiguration(
			data,
		);
	}

	public async getUserSkills(userId: string) {
		const token = 'Bearer ' + (await this.getAuthToken());
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

	private async getAuthToken(): Promise<string> {
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

	public async getUserByPhone(phone: string): Promise<User> {
		if (!phone.startsWith('+')) phone = '+' + phone;

		const token = 'Bearer' + this.getAuthToken();
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

		// response.Data.ExtraFields = new Dictionary<string, string>();

		// var dictObj = JObject.FromObject(obj).ToObject<Dictionary<string, object>>();
		// var modelData = JsonConvert.SerializeObject(response.Data);
		// var responseObj = JObject.Parse(modelData);

		// foreach (var key in dictObj.Keys)
		// {
		//     if (!responseObj.ContainsKey(key))
		//     {
		//         response.Data.ExtraFields.Add(key, $"{dictObj[key]}");
		//     }
		// }
	}

	public async post(
		hypeUrl: string,
		data: Record<string, any>,
	): Promise<any> {
		const env = await this.serviceCxperiumConfiguration.execute();
		const url = `${env.automateConfig.HypeUrl}/webhook/${hypeUrl}`;

		const response = await fetch(url, {
			method: 'POST',
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
