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

		console.info(`EXECUTING EVENT: ${EMessageEvent[event]}`);
		try {
			const dialogImport = await import(runParams.dialogFileParams.path);
			const dialog = new dialogImport.default(runParams);
			await dialog[func](thisObj);
		} catch (error) {
			console.info(
				`${EMessageEvent[event]} is not implemented. You may want to implement IMessageEvent interface to your Entry.ts file if you require to customize the response! (NOT REQUIRED!)`,
			);
		}
	}
}

export { DynamicHandler };
