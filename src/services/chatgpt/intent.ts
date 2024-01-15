// Node modules.
import { ChatGPTAPI } from 'chatgpt';

// Services.
import ServiceCxperiumConfiguration from '../cxperium/configuration';

export default class {
	private serviceCxperiumConfig: ServiceCxperiumConfiguration;

	constructor(serviceCxperiumConfiguration: ServiceCxperiumConfiguration) {
		this.serviceCxperiumConfig = serviceCxperiumConfiguration;
	}

	public async chatGPTMatch(text: string): Promise<string> {
		const chatgptConfig = (await this.serviceCxperiumConfig.execute())
			.chatgptConfig;

		const api = new ChatGPTAPI({
			apiKey: chatgptConfig.ApiKey,
			completionParams: {
				model: chatgptConfig.Model,
				temperature: Number(chatgptConfig.Temperature),
				max_tokens: Number(chatgptConfig.MaxTokens),
			},
		});

		const completion = await api.sendMessage(text);

		return completion.text;
	}
}
