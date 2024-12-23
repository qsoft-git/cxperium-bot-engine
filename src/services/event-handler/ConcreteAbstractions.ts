// ? Types.
import { TBaseDialogCtor } from '../../types/base-dialog';
import { TIntentPrediction } from '../../types/intent-prediction';
import { MessageEventHandler } from './MessageEventHandler';
import { IHandler } from './IHandler';
import { EMessageEvent } from '../../types/message-event';

class ConcreteHandler extends MessageEventHandler {
	constructor(handler: IHandler) {
		super(handler);
	}

	public async handle(
		event: EMessageEvent,
		runParams: TBaseDialogCtor,
		prediction: TIntentPrediction | undefined,
	): Promise<void> {
		this.messageEventHandler.handle(event, runParams, prediction);
	}
}

export { ConcreteHandler };
