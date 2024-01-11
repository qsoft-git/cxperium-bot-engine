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
	TDefaultButton,
} from '../../types/whatsapp/message';

export default class extends ServiceWhatsApp {
	constructor(params: ServiceCxperiumConfiguration) {
		super(params);
	}

	public async sendLocationRequest(
		to: string,
		message: string,
	): Promise<void> {
		try {
			const body = {
				recipient_type: 'individual',
				to: to,
				type: 'interactive',
				interactive: {
					type: 'location_request_message',
					body: {
						type: 'text',
						text: message,
					},
					action: {
						name: 'send_location',
					},
				},
			};

			await this.wpRequest(body, 'v1/messages');
		} catch (error) {
			throw error!;
		}
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

			await this.wpRequest(msg, 'v1/messages');
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
		const defaultButtons: TDefaultButton[] = [];

		buttons.forEach((x) => {
			const button: TDefaultButton = {
				type: 'reply',
				reply: {
					id: x.id,
					title: x.title,
				},
			};
			defaultButtons.push(button);
		});

		const buttonAction: TButtonAction = {
			buttons: defaultButtons,
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

		await this.wpRequest(msg, 'v1/messages');
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

		await this.wpRequest(msg, 'v1/messages');
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

		return await this.wpRequest(msg, 'v1/messages');
	}
}
