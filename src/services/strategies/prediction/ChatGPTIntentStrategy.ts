import { TIntentPrediction } from '../../../types/intent-prediction';
import ServiceChatGPT from '../../chatgpt/match';
import { IIntentStrategy } from './IIntentStrategy';

class ChatGPTIntentStrategy implements IIntentStrategy {
	async match(dialog: any, activity: string): Promise<TIntentPrediction> {
		const services = dialog.services;
		const env = await services.cxperium.configuration.execute();
		const prediction: TIntentPrediction = {
			isMatch: false,
			intent: null,
			type: null,
			fulfillment: null,
			chatgptMessage: null,
		};

		if (env.chatgptConfig.IsEnabled && activity.length > 1) {
			const chatgptService = new ServiceChatGPT(services);
			return await chatgptService.chatGPTMatch(
				activity,
				env.chatgptConfig,
			);
		}

		if (env.enterpriseChatgptConfig.IsEnabled && activity.length > 1) {
			const chatgptService = new ServiceChatGPT(services);
			return await chatgptService.enterpriseChatGPTMatch(
				activity,
				dialog.activity.from,
				env.enterpriseChatgptConfig,
			);
		}

		return prediction;
	}
}

export { ChatGPTIntentStrategy };
