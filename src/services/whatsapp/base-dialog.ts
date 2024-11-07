// ? Types.
import { TActivity } from '../../types/whatsapp/activity';
import { TCxperiumContact } from '../../types/cxperium/contact';
import {
	TAppLocalsServices,
	TBaseDialogCtor,
	TBaseDialogDialogFileParams,
} from '../../types/base-dialog';

// ? Services.
import BaseConversation from '../conversation';
import {
	TButton,
	TMultiProductSection,
	TRow,
	TSection,
} from '../../types/whatsapp/message';

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

	public async transferToLiveRepresentative() {
		await this.services.cxperium.transfer.transferToRepresentative(
			this.contact,
			this.conversation,
		);
	}

	public async sendLocationMessage(
		lat: number,
		long: number,
		name: string,
		address: string,
	) {
		const msg = await this.services.whatsapp.message.sendLocationMessage(
			this.contact.phone,
			lat,
			long,
			name,
			address,
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

	public async sendListMessageWithSection(
		header: string,
		footer: string,
		message: string,
		buttonTitle: string,
		sections: TSection[],
	) {
		const msg =
			await this.services.whatsapp.message.sendListMessageWithSection(
				this.contact.phone,
				header,
				footer,
				message,
				buttonTitle,
				sections,
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

	public async sendImageWithUrl(url: string) {
		const msg = await this.services.whatsapp.media.sendImageWithUrl(
			this.contact.phone,
			url,
		);

		return msg;
	}

	public async sendDocumentWithUrl(filename: string, url: string) {
		const msg = await this.services.whatsapp.media.sendDocumentWithUrl(
			this.contact.phone,
			filename,
			url,
		);

		return msg;
	}

	public async sendSurvey(surveyId: string) {
		await this.services.cxperium.transfer.startSurvey(
			surveyId,
			this.contact,
			this,
		);
	}

	public async getLocalizationText(key: string) {
		const localization =
			await this.services.cxperium.language.getLanguageByKey(
				this.conversation.conversation.languageId,
				key,
			);

		return localization;
	}

	public async sendSingleProductMessage(
		body: string,
		footer: string | null,
		catalogId: string,
		productRetailerId: string,
	) {
		return await this.services.whatsapp.message.sendSingleProductMessage(
			this.contact.phone,
			body,
			footer,
			catalogId,
			productRetailerId,
		);
	}

	public async sendMultiProductMessage(
		header: string | null,
		body: string,
		footer: string | null,
		catalogId: string,
		sections: TMultiProductSection[],
	) {
		return await this.services.whatsapp.message.sendMultiProductMessage(
			this.contact.phone,
			header,
			body,
			footer,
			catalogId,
			sections,
		);
	}

	public async sendFlowMessage(
		header: string | null,
		body: string,
		footer: string | null,
		flowToken: string,
		flowId: string,
		flowCta: string,
		screen: string,
		data: object | null,
	) {
		return await this.services.whatsapp.message.sendFlowMessage(
			this.contact.phone,
			header,
			body,
			footer,
			flowToken,
			flowId,
			flowCta,
			screen,
			data,
		);
	}
}
