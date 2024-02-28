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
	TMultiProductMessage,
	TMultiProductSection,
} from '../../types/whatsapp/message';
import { TFlowMessage } from '../../types/whatsapp/flow';

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

			return await this.wpRequest(body, 'v1/messages');
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

			return await this.wpRequest(msg, 'v1/messages');
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

		return await this.wpRequest(msg, 'v1/messages');
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

		return await this.wpRequest(msg, 'v1/messages');
	}

	public async sendListMessageWithSection(
		to: string,
		header: string,
		footer: string,
		message: string,
		buttonTitle: string,
		sections: TSection[],
	) {
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

		return await this.wpRequest(msg, 'v1/messages');
	}

	public async sendLocationMessage(
		to: string,
		lat: number,
		long: number,
		name: string,
		address: string,
	) {
		const msg = {
			recipient_type: 'individual',
			to,
			type: 'location',
			location: {
				longitude: long,
				latitude: lat,
				name,
				address,
			},
		};

		return await this.wpRequest(msg, 'v1/messages');
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

	public async sendSingleProductMessage(
		to: string,
		body: string,
		footer: string | null,
		catalogId: string,
		productRetailerId: string,
	) {
		const msg = {
			recipient_type: 'individual',
			to,
			type: 'interactive',
			interactive: {
				type: 'product',
				body: {
					text: body,
				},
				footer: {
					text: footer,
				},
				action: {
					catalog_id: catalogId,
					product_retailer_id: productRetailerId,
				},
			},
		};

		return await this.wpRequest(msg, 'v1/messages');
	}

	public async sendMultiProductMessage(
		to: string,
		header: string | null,
		body: string,
		footer: string | null,
		catalogId: string,
		sections: TMultiProductSection[],
	) {
		const msg: TMultiProductMessage = {
			messaging_product: 'whatsapp',
			recipient_type: 'individual',
			to: to,
			type: 'interactive',
			interactive: {
				type: 'product_list',
				header: {
					type: 'text',
					text: header,
				},
				body: {
					text: body,
				},
				footer: {
					text: footer,
				},
				action: {
					catalog_id: catalogId,
					sections: sections,
				},
			},
		};

		return await this.wpRequest(msg, 'v1/messages');
	}

	public async sendFlowMessage(
		to: string,
		header: string | null,
		body: string,
		footer: string | null,
		flowToken: string,
		flowId: string,
		flowCta: string,
		screen: string,
		data: object | null,
	) {
		const msg: TFlowMessage = {
			recipient_type: 'individual',
			to,
			type: 'interactive',
			interactive: {
				type: 'flow',
				header: {
					text: header,
				},
				body: {
					text: body,
				},
				footer: {
					text: footer,
				},
				action: {
					name: 'flow',
					parameters: {
						flow_message_version: '3',
						flow_token: flowToken,
						flow_id: flowId,
						flow_cta: flowCta,
						flow_action: 'navigate',
						flow_action_payload: {
							screen: screen,
						},
					},
				},
			},
		};

		if (data)
			msg.interactive.action.parameters.flow_action_payload.data = data;

		return await this.wpRequest(msg, 'v1/messages');
	}
}
