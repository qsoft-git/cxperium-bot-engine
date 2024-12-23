// ? Types.
import { TBaseDialogCtor } from '../../types/base-dialog';
import { TIntentPrediction } from '../../types/intent-prediction';
import { EMessageEvent } from '../../types/message-event';
import { IHandler } from './IHandler';

abstract class MessageEventHandler {
	protected messageEventHandler: IHandler;

	constructor(messageEventHandler: IHandler) {
		this.messageEventHandler = messageEventHandler;
	}

	public async handle(
		event: EMessageEvent,
		runParams: TBaseDialogCtor,
		prediction: TIntentPrediction,
	): Promise<void> {
		this.messageEventHandler.handle(event, runParams, prediction);
	}
}

export { MessageEventHandler };
