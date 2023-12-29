// Modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '.';

// Interfaces.
import { ICxperiumParams } from '../../interfaces/services/cxperium';
import { Intent } from '../../types/cxperium/intent';

// Config.
import UtilConfig from '../../utils/config';

export default class extends ServiceCxperium {
	private cache = UtilConfig.getInstance().cache;
	constructor(data: ICxperiumParams) {
		super(data);
	}

	async getAllIntents(): Promise<Intent[]> {
		const cached: Intent[] | undefined = this.cache.get('all-intents');

		if (cached) return cached;

		const response = (await fetch(this.baseUrl + '/api/assistant/intent', {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;

		const intents: Intent[] = [];

		for (const intent of response.data.data.data) {
			const int: Intent = {
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
