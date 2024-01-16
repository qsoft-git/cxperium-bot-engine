// Node modules.
import { OpenAI } from 'openai';
import { TAppLocalsServices } from '../../types/base-dialog';
import { TIntentPrediction } from '../../types/intent-prediction';

export default class {
	private services: TAppLocalsServices;
	constructor(services: TAppLocalsServices) {
		this.services = services;
	}

	public async chatGPTMatch(text: string): Promise<TIntentPrediction> {
		const prediction: TIntentPrediction = {
			isMatch: false,
			type: 'CHATGPT',
			intent: null,
			fulfillment: null,
			chatgptMessage: null,
		};
		const chatgptConfig = (
			await this.services.cxperium.configuration.execute()
		).chatgptConfig;

		if (!chatgptConfig.IsEnabled) return prediction;

		const openai = new OpenAI({
			apiKey: chatgptConfig.APIKey,
		});

		const completion = await openai.chat.completions.create({
			messages: [{ role: 'user', content: text }],
			model: chatgptConfig.Model,
		});

		if (completion.choices && completion.choices.length > 0) {
			prediction.isMatch = true;
			prediction.chatgptMessage = completion.choices[0].message?.content;
		}

		return prediction;
	}
}
