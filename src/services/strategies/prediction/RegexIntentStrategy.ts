import { TIntentPrediction } from '../../../types/intent-prediction';
import { IIntentStrategy } from './IIntentStrategy';

class RegexIntentStrategy implements IIntentStrategy {
	async match(dialog: any, activity: string): Promise<TIntentPrediction> {
		const services = dialog.services;
		const prediction: TIntentPrediction = {
			isMatch: false,
			intent: null,
			type: null,
			fulfillment: null,
			chatgptMessage: null,
		};

		let cxperiumAllIntents = services.cxperium.intent.cache.get(
			'all-intents',
		) as any;
		if (!cxperiumAllIntents) {
			cxperiumAllIntents = await services.cxperium.intent.getAllIntents();
		}

		const channelNumber = '1';
		const intentParams = cxperiumAllIntents.find(
			(item: any) =>
				channelNumber === item.channel &&
				new RegExp(item.regexValue, 'i').test(activity),
		);

		if (intentParams) {
			prediction.intent = intentParams.name;
			prediction.isMatch = true;
			prediction.type = 'REGEX';
		}

		return prediction;
	}
}

export { RegexIntentStrategy };
