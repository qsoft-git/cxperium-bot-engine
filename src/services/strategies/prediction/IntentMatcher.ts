import { IIntentStrategy } from './IIntentStrategy';
import { RegexIntentStrategy } from './RegexIntentStrategy';
import { DialogflowIntentStrategy } from './DialogflowIntentStrategy';
import { ChatGPTIntentStrategy } from './ChatGPTIntentStrategy';
import { TIntentPrediction } from '../../../types/intent-prediction';
import { Dialog } from '../../../types/dialog';

class IntentMatcher {
	private strategies: IIntentStrategy[];

	constructor() {
		this.strategies = [
			new RegexIntentStrategy(),
			new DialogflowIntentStrategy(),
			new ChatGPTIntentStrategy(),
		];
	}

	async match(dialog: Dialog, activity: string): Promise<TIntentPrediction> {
		for (const strategy of this.strategies) {
			const prediction = await strategy.match(dialog, activity);
			if (prediction.isMatch) {
				return prediction;
			}
		}

		return {
			isMatch: false,
			intent: null,
			type: null,
			fulfillment: null,
			chatgptMessage: null,
		};
	}
}

export { IntentMatcher };
