import { Dialog } from '../../../types/dialog';
import { TIntentPrediction } from '../../../types/intent-prediction';
import { EMessageEvent } from '../../../types/message-event';
import { IMessageStrategy } from './IMessageStrategy';

class FileReceivedStrategy implements IMessageStrategy {
	async handle(dialog: Dialog, prediction: TIntentPrediction): Promise<void> {
		try {
			await dialog.services.dialog.runMessageEvent(
				dialog,
				prediction,
				EMessageEvent.ON_FILE_RECEIVED,
			);
		} catch (error: any) {
			// ? Proceed to main logic.
		}
	}
}

export { FileReceivedStrategy };
