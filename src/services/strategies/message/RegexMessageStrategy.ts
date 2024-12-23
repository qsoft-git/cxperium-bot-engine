import { Dialog } from '../../../types/dialog';
import { TIntentPrediction } from '../../../types/intent-prediction';
import { ExecutionInterface } from '../../../types/whatsapp/flow';
import { IMessageStrategy } from './IMessageStrategy';

class IntentStrategy implements IMessageStrategy {
	async handle(dialog: Dialog, prediction: TIntentPrediction): Promise<void> {
		const runParams = await dialog.services.dialog.prepareRunParams(
			dialog,
			prediction.intent!,
			ExecutionInterface.RUN_DIALOG,
		);

		await dialog.services.dialog.runDynamicImport(
			runParams,
			undefined,
			ExecutionInterface.RUN_DIALOG,
		);
	}
}

export { IntentStrategy };
