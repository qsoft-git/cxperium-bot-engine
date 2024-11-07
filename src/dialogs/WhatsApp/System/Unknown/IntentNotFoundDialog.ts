// ? Types.
import {
	IDialog,
	ServiceWhatsappBaseDialog,
	TBaseDialogCtor,
} from '../../../../index';

// ? Environments.
const {
	FIRST_CALLBACK_REDIRECT_MAIN_MENU_STATUS,
	FIRST_CALLBACK_REDIRECT_MAIN_MENU_ID,
	FIRST_CALLBACK_REDIRECT_MAIN_MENU_NAME,
} = process.env;

export default class extends ServiceWhatsappBaseDialog implements IDialog {
	constructor(data: TBaseDialogCtor) {
		super(data);
	}
	async runDialog(): Promise<void> {
		if (
			FIRST_CALLBACK_REDIRECT_MAIN_MENU_STATUS &&
			FIRST_CALLBACK_REDIRECT_MAIN_MENU_STATUS === 'true'
		) {
			await this.sendButtonMessage(
				'💬',
				'',
				await this.getLocalizationText('understand_message'),
				[
					{
						id: FIRST_CALLBACK_REDIRECT_MAIN_MENU_ID || 'main_menu',
						title:
							FIRST_CALLBACK_REDIRECT_MAIN_MENU_NAME ||
							'🔙 Ana Menüye Dön',
					},
				],
			);
		} else {
			await this.sendMessage(
				await this.getLocalizationText('understand_message'),
			);
		}
	}
}
