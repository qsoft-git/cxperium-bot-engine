import { TCxperiumLiveConfig } from '../../../types/configuration/live';
import { Dialog } from '../../../types/dialog';
import { TIntentPrediction } from '../../../types/intent-prediction';
import { EMessageEvent } from '../../../types/message-event';
import { TButton } from '../../../types/whatsapp/message';
import BaseConversation from '../../conversation';
import { IMessageStrategy } from './IMessageStrategy';

export class DidNotUnderstandStrategy implements IMessageStrategy {
	async handle(dialog: Dialog, prediction: TIntentPrediction): Promise<void> {
		const liveConfig: TCxperiumLiveConfig = (
			await dialog.services.cxperium.configuration.execute()
		).cxperiumLiveConfig;
		const conversation: BaseConversation = dialog.conversation;
		const faultCount = conversation.getFaultCount();

		if (
			liveConfig.IsActive &&
			faultCount >= liveConfig.TransferFaultCount
		) {
			conversation.setFaultCount(0);

			const isAutomaticTransferMessageEnabled = JSON.parse(
				process.env.TRANSFER_MESSAGE_ENABLED || 'true',
			);

			if (isAutomaticTransferMessageEnabled) {
				const buttons: TButton[] = [
					{
						id: 'humantransfer_yes',
						title: await dialog.services.cxperium.language.getLanguageByKey(
							conversation.conversation.languageId,
							'yes_humantransfer',
						),
					},
					{
						id: 'humantransfer_no',
						title: await dialog.services.cxperium.language.getLanguageByKey(
							conversation.conversation.languageId,
							'no_humantransfer',
						),
					},
				];

				await dialog.services.whatsapp.message.sendButtonMessage(
					dialog.contact.phone,
					await dialog.services.cxperium.language.getLanguageByKey(
						conversation.conversation.languageId,
						'transfer_representative_title',
					),
					'',
					await dialog.services.cxperium.language.getLanguageByKey(
						conversation.conversation.languageId,
						'transfer_message_to_representative',
					),
					buttons,
				);
			}
		} else {
			conversation.increaseFaultCount();
			try {
				await dialog.services.dialog.runMessageEvent(
					dialog,
					prediction,
					EMessageEvent.ON_DID_NOT_UNDERSTAND,
				);
			} catch (error: any) {
				await dialog.services.dialog.runWithIntentName(
					dialog,
					'CXPerium.Dialogs.WhatsApp.System.Unknown.IntentNotFoundDialog',
				);
			}
		}
	}
}
