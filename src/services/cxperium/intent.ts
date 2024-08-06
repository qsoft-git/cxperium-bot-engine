// Fetch Retry.
import fetchRetry from '../fetch';

// Services.
import ServiceCxperium from '.';

// Datas.
import DataGeneral from '../../data/general';

// Types.
import { TCxperiumIntent } from '../../types/cxperium/intent';
import { TCxperiumServiceParams } from '../../types/cxperium/service';

export default class extends ServiceCxperium {
	public cache = DataGeneral.cache;
	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.getAllIntents();
	}

	async getAllIntents(): Promise<TCxperiumIntent[]> {
		const cached: TCxperiumIntent[] | undefined =
			this.cache.get('all-intents');

		if (cached) return cached;

		const response = (await fetchRetry(
			this.baseUrl + '/api/assistant/intent',
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json())) as any;

		const intents: TCxperiumIntent[] = [];

		for (const intent of response.data.data) {
			const int: TCxperiumIntent = {
				name: intent.intentName,
				regexValue: intent.regexValue,
				languageId: intent.languageId,
				channel: intent.channel,
			};

			intents.push(int);
		}

		this.cache.set('all-intents', intents);
		console.info('Intents found and cached');
		return intents;
	}
}
