// ? Types.
import { TBaseDialogCtor } from '../../types/base-dialog';
import { TIntentPrediction } from '../../types/intent-prediction';
import { EMessageEvent } from '../../types/message-event';

interface IHandler {
	handle(
		event: EMessageEvent,
		runParams: TBaseDialogCtor,
		prediction: TIntentPrediction | undefined,
	): void;
}

export { IHandler };
