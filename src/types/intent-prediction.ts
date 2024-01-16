export type TIntentPrediction = {
	isMatch: boolean;
	intent: string | null;
	type: 'CHATGPT' | 'REGEX' | 'DIALOGFLOW' | null;
	fulfillment: string | null;
	chatgptMessage: string | null;
};
