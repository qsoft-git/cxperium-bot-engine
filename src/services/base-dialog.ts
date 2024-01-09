// Types.
import { TActivity } from '../types/whatsapp/activity';
import { TCxperiumContact } from '../types/cxperium/contact';
import {
	TAppLocalsServices,
	TBaseDialogCtor,
	TBaseDialogDialogFileParams,
} from '../types/base-dialog';

// Services.
import BaseConversation from './conversation';
import { TButton, TRow } from '../types/whatsapp/message';

export default class {
	contact: TCxperiumContact;
	activity: TActivity;
	conversation: BaseConversation;
	services: TAppLocalsServices;
	dialogFileParams: TBaseDialogDialogFileParams;

	constructor(data: TBaseDialogCtor) {
		this.activity = data.activity;
		this.contact = data.contact;
		this.conversation = data.conversation;
		this.services = data.services;
		this.dialogFileParams = data.dialogFileParams;
	}

	public async sendMessage(message: string) {
		const msg = await this.services.whatsapp.message.sendRegularMessage(
			this.contact.phone,
			message,
		);

		return msg;
	}

	public async sendButtonMessage(
		header: string,
		footer: string,
		message: string,
		buttons: TButton[],
	) {
		const msg = await this.services.whatsapp.message.sendButtonMessage(
			this.contact.phone,
			header,
			footer,
			message,
			buttons,
		);

		return msg;
	}

	public async sendListMessage(
		header: string,
		footer: string,
		message: string,
		buttonTitle: string,
		rows: TRow[],
	) {
		const msg = await this.services.whatsapp.message.sendListMessage(
			this.contact.phone,
			header,
			footer,
			message,
			buttonTitle,
			rows,
		);

		return msg;
	}

	public async sendLocationRequest(message: string) {
		const msg = await this.services.whatsapp.message.sendLocationRequest(
			this.contact.phone,
			message,
		);

		return msg;
	}

	public async sendImageMessage(imageId: string, caption: string) {
		const msg = await this.services.whatsapp.message.sendImageMessage(
			this.contact.phone,
			imageId,
			caption,
		);

		return msg;
	}

	public async getLocalizationText(key: string) {
		const localization =
			await this.services.cxperium.language.getLanguageByKey(
				this.conversation.conversation.languageId,
				key,
			);

		return localization;
	}
}
