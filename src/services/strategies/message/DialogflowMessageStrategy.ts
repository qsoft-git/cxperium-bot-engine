import { Dialog } from '../../../types/dialog';
import { TIntentPrediction } from '../../../types/intent-prediction';
import { EMessageEvent } from '../../../types/message-event';
import { IMessageStrategy } from './IMessageStrategy';

class DialogflowMessageStrategy implements IMessageStrategy {
	async handle(dialog: Dialog, prediction: TIntentPrediction): Promise<void> {
		try {
			await dialog.services.dialog.runMessageEvent(
				dialog,
				prediction,
				EMessageEvent.ON_DIALOGFLOW_MESSAGE,
			);
		} catch (error: any) {
			await dialog.services.whatsapp.message.sendRegularMessage(
				dialog.contact.phone,
				prediction.fulfillment!,
			);
		}
	}
}

export { DialogflowMessageStrategy };
