// Node modules.
import * as df from '@google-cloud/dialogflow';

// Types.
import { TAppLocalsServices } from '../../types/base-dialog';
import { TIntentPrediction } from '../../types/intent-prediction';

export default class {
	private services: TAppLocalsServices;
	constructor(services: TAppLocalsServices) {
		this.services = services;
	}

	public async dialogflowMatch(
		text: string,
		phone: string,
		language: string,
	): Promise<TIntentPrediction> {
		const env = (await this.services.cxperium.configuration.execute())
			.dialogflowConfig;

		const prediction: TIntentPrediction = {
			isMatch: false,
			type: null,
			intent: null,
			fulfillment: null,
			chatgptMessage: null,
		};

		if (!env.IsEnable) return prediction;

		process.env.GOOGLE_APPLICATION_CREDENTIALS = `./${env.CredentialsFilePath}`;
		const projectId = env.ProjectId;
		const sessionId = phone;

		const sessionClient = new df.SessionsClient();
		const sessionPath = sessionClient.projectAgentSessionPath(
			projectId,
			sessionId,
		);

		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: text,
					languageCode: language,
				},
			},
		};

		const response = await sessionClient.detectIntent(request);

		const queryResult = response[0].queryResult?.fulfillmentMessages;

		if (queryResult) {
			const fields = queryResult[0].payload
				? queryResult[0].payload?.fields
				: null;

			const fulfillmentText = queryResult[0].text?.text;
			const payload =
				queryResult[1]?.payload?.fields?.intent?.stringValue;

			if (payload) {
				prediction.isMatch = true;
				prediction.intent = payload;
			} else if (fields) {
				const intent = fields.intent.stringValue;
				prediction.isMatch = true;
				prediction.intent = intent ? intent : null;
			} else if (fulfillmentText) {
				prediction.isMatch = true;
				prediction.fulfillment = fulfillmentText[0];
			}
		}

		prediction.type = 'DIALOGFLOW';
		return prediction;
	}
}
