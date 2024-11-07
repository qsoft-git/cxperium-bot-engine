// ? Types.
import { TIntentPrediction } from '../types/intent-prediction';

interface IMessageEvent {
	onFileReceived?(messageObject: any): void;
	onChatGPTMessage?(messageObject: TIntentPrediction): void;
	onDialogflowMessage?(messageObject: TIntentPrediction): void;
	onDidNotUnderstand?(): void;
	onEndOfChatSession?(): void;
	onClosingOfLiveChat?(): void;
}

export { IMessageEvent };
