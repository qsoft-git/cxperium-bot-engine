// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '.';

// Types.
import { TCxperiumIntent } from '../../types/cxperium/intent';
import { TCxperiumServiceParams } from '../../types/cxperium/service';

// Utils.
import UtilConfig from '../../utils/config';

export default class extends ServiceCxperium {
	private cache = UtilConfig.getInstance().cache;
	constructor(data: TCxperiumServiceParams) {
		super(data);
		this.getAllIntents();
	}

	async getAllIntents(): Promise<TCxperiumIntent[]> {
		const cached: TCxperiumIntent[] | undefined =
			this.cache.get('all-intents');

		if (cached) return cached;

		const response = (await fetch(this.baseUrl + '/api/assistant/intent', {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;

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

		this.cache.set('all-intents', intents, 1000);
		console.info('Intents found and cached');
		return intents;
	}
}
