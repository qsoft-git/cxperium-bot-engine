import ServiceDialogflow from '../../dialogflow/match';
import { TIntentPrediction } from '../../../types/intent-prediction';
import { IIntentStrategy } from './IIntentStrategy';

class DialogflowIntentStrategy implements IIntentStrategy {
	async match(dialog: any, activity: string): Promise<TIntentPrediction> {
		const services = dialog.services;
		const env = await services.cxperium.configuration.execute();
		const prediction: TIntentPrediction = {
			isMatch: false,
			intent: null,
			type: null,
			fulfillment: null,
			chatgptMessage: null,
		};

		if (env.dialogflowConfig.IsEnable && activity.length > 1) {
			const df = new ServiceDialogflow(services);
			return await df.dialogflowMatch(
				activity,
				dialog.contact._id,
				dialog.conversation.conversation.cultureCode,
			);
		}

		return prediction;
	}
}

export { DialogflowIntentStrategy };
