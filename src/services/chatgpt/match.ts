// Node modules.
import { OpenAI } from 'openai';

// Types.
import { TAppLocalsServices } from '../../types/base-dialog';
import { TIntentPrediction } from '../../types/intent-prediction';
import { TChatGPTResponse } from '../../types/chatgpt/response';

// Datas.
import DataGeneral from '../../data/general';

// Constants.
const UNKNOWN_REGEX = new RegExp('bilmiyorum', 'gi');

export default class {
	private services: TAppLocalsServices;
	private cache = DataGeneral.cache;
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

	public async chatgptAssistantChat(
		text: string,
		sessionKey: string,
		env: any,
	): Promise<any> {
		try {
			const cache = this.cache;

			// OpenAI instance.
			const openai = new OpenAI({
				apiKey: env.chatgptConfig.APIKey,
			});

			let threadId: string = '';

			const question = text;
			if (!question) throw new Error('Question not found!');

			if (sessionKey && String(sessionKey).length < 2)
				throw new Error(
					'Session keyword cannot be smaller than 2 characters!',
				);
			if (sessionKey && String(sessionKey).length > 42)
				throw new Error(
					'Session keyword cannot be larger than 42 characters!',
				);

			await sessionFinder();

			try {
				await threadMessageCreate();
			} catch (error) {
				threadId = await sessionFinder();
				try {
					console.error(error);
					await threadMessageCreate();
				} catch (err) {
					console.error(err);
					throw new Error(
						'Maalesef, Bilinmeyen bir hata gerçekleşti!',
					);
				}
			}

			const run: any = await openai.beta.threads.runs.createAndPoll(
				threadId,
				{
					assistant_id: env.chatgptConfig.AsistanId,
				},
			);

			const response: TChatGPTResponse = {
				status: false,
				text: '',
				files: [],
			};

			let replyAi = '';
			let annotations: any;

			if (run.status === 'completed') {
				await new Promise((resolve) => setTimeout(resolve, 3000));

				const messages: any = await openai.beta.threads.messages.list(
					run.thread_id,
				);

				const messagesData: any = messages.data.reverse();
				const lastMessage: any = messagesData[messagesData.length - 1];

				replyAi = lastMessage?.content?.[0]?.text?.value;
				annotations = lastMessage?.content?.[0].text?.annotations;

				const files = await openai.files.list();

				for (const annot of annotations) {
					const file: any = files?.data?.find(
						(x) => x?.id === annot?.file_citation?.file_id,
					);

					if (file) response.files.push(file);
				}
			}

			if (replyAi && UNKNOWN_REGEX.test(replyAi)) {
				response.status = false;
				response.text =
					'Maalesef, sorunun cevabını bulamadım. Lütfen tekrar sorunuz.';
			} else {
				response.status = true;
				response.text = String(replyAi)
					.replace(/【[\d:]+†?\w+】/g, '')
					.trim();
			}

			return response;

			async function sessionFinder(): Promise<string> {
				if (sessionKey) {
					const findOneNodeCacheSession: any = cache.get(sessionKey);

					if (!findOneNodeCacheSession) {
						const thread = await openai.beta.threads.create();

						threadId = thread.id;
					} else {
						threadId = findOneNodeCacheSession;
					}

					cache.set(sessionKey, threadId);

					return threadId;
				} else {
					const thread = await openai.beta.threads.create();
					threadId = thread.id;
					return threadId;
				}
			}

			async function threadMessageCreate() {
				return await openai.beta.threads.messages.create(threadId, {
					role: 'user',
					content: question,
				});
			}
		} catch (error) {
			console.error(error);
		}
	}
}
