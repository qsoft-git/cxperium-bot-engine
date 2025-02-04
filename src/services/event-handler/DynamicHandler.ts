// ? Types.
import { TBaseDialogCtor } from '../../types/base-dialog';
import { TIntentPrediction } from '../../types/intent-prediction';
import { EMessageEvent } from '../../types/message-event';
import {
	ExecutionInterface,
	executionParamsMapping,
} from '../../types/whatsapp/flow';
import { IHandler } from './IHandler';

const ENTRY_INTENT_NAME = 'CXPerium.Dialogs.WhatsApp.Entry';

class DynamicHandler implements IHandler {
	public async handle(
		event: EMessageEvent,
		runParams: TBaseDialogCtor,
		prediction: TIntentPrediction | undefined,
	): Promise<void> {
		const dialog = await runParams.services.dialog.findDialog(
			ENTRY_INTENT_NAME,
			ExecutionInterface[event],
		);

		const func = executionParamsMapping[event];
		const thisObj = {
			...dialog,
			prediction,
		};

		const dialogImport = await import(runParams.dialogFileParams.path);
		const dialogInstance = new dialogImport.default(runParams);
		const isFuncImplemented = dialogInstance[func];

		if (!isFuncImplemented) {
			throw new Error(`${func} is not implemented!`);
		}

		console.info(`EXECUTING EVENT: ${EMessageEvent[event]}`);

		await dialogInstance[func](thisObj);
	}
}

export { DynamicHandler };
