// Node modules.
import { OpenAI } from 'openai';
import { TAppLocalsServices } from '../../types/base-dialog';
import { TIntentPrediction } from '../../types/intent-prediction';

export default class {
	private services: TAppLocalsServices;
	constructor(services: TAppLocalsServices) {
		this.services = services;
	}

	public async chatGPTMatch(
		text: string,
		chatgptConfig: any,
	): Promise<TIntentPrediction> {
		const prediction: TIntentPrediction = {
			isMatch: false,
			type: 'CHATGPT',
			intent: null,
			fulfillment: null,
			chatgptMessage: null,
		};

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

		prediction.type = 'CHATGPT';
		return prediction;
	}

	public async enterpriseChatGPTMatch(
		text: string,
		client: any,
		enterpriseChatgptConfig: any,
	): Promise<TIntentPrediction> {
		const prediction: TIntentPrediction = {
			isMatch: false,
			type: 'CHATGPT',
			intent: null,
			fulfillment: null,
			chatgptMessage: null,
		};

		const body = {
			question: text,
			response: ['TEXT'],
		};

		const auth = `Basic ${Buffer.from(
			`${enterpriseChatgptConfig.Username}:${enterpriseChatgptConfig.Password}`,
		).toString('base64')}`;

		const fetchClient = client
			? `${enterpriseChatgptConfig.URL}/api/chat/${client}`
			: `${enterpriseChatgptConfig.URL}/api/chat`;

		const response = (await fetch(fetchClient, {
			method: 'POST',
			headers: {
				Authorization: auth,
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then((response) => response.json())) as any;

		if (response) {
			prediction.isMatch = true;
			prediction.chatgptMessage = response.text;
		}

		prediction.type = 'CHATGPT';
		return prediction;
	}
}
