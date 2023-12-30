// Services.
import ServiceCxperiumConfiguration from '../../services/cxperium/configuration';
import ServiceWhatsApp from './index';

// Types.
import {
	TButton,
	TRow,
	TWpInteractiveListMessage,
	TWpInteractiveButtonMessage,
	TSection,
	TButtonAction,
	TListAction,
} from '../../types/whatsapp/message';

export default class extends ServiceWhatsApp {
	constructor(params: ServiceCxperiumConfiguration) {
		super(params);
	}

	private async request(body: string | Record<string, unknown>) {
		if (typeof body === 'object') body = JSON.stringify(body);

		const response = await (
			await fetch('path', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'D360-API-KEY': 'env.WHATSAPP_API_KEY',
				},
				body,
			})
		).json();

		if (response.meta.success === false) {
			throw response.meta.developer_message;
		}

		return response;
	}

	public async sendRegularMessage(to: string, body: string): Promise<void> {
		try {
			const msg = {
				recipient_type: 'individual',
				to,
				type: 'text',
				text: {
					body,
				},
			};

			await this.request(msg);
		} catch (err: unknown) {
			throw err!;
		}
	}

	public async sendButtonMessage(
		to: string,
		header: string,
		footer: string,
		message: string,
		buttons: TButton[],
	) {
		const buttonAction: TButtonAction = {
			buttons: buttons,
		};

		const msg: TWpInteractiveButtonMessage = {
			recipient_type: 'individual',
			to,
			type: 'interactive',
			interactive: {
				header: {
					type: 'text',
					text: header,
				},
				body: {
					text: message,
				},
				footer: {
					text: footer,
				},
				type: 'button',
				action: buttonAction,
			},
		};

		await this.request(msg);
	}

	public async sendListMessage(
		to: string,
		header: string,
		footer: string,
		message: string,
		buttonTitle: string,
		rows: TRow[],
	) {
		const sections: TSection[] = [{ title: '', rows: rows }];

		const listAction: TListAction = {
			button: buttonTitle,
			sections: sections,
		};

		const msg: TWpInteractiveListMessage = {
			recipient_type: 'individual',
			to,
			type: 'interactive',
			interactive: {
				header: {
					type: 'text',
					text: header,
				},
				body: {
					text: message,
				},
				footer: {
					text: footer,
				},
				type: 'list',
				action: listAction,
			},
		};

		await this.request(msg);
	}

	public async sendImageMessage(
		to: string,
		imageId: string,
		caption: string,
	) {
		const msg = {
			recipient_type: 'individual',
			to,
			type: 'image',
			image: {
				id: imageId,
				caption: caption,
			},
		};

		return await this.request(msg);
	}
}
