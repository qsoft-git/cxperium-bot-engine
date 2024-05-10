import {
	TActivity,
	TDocumentMessage,
	TImageMessage,
	TInteractiveMessage,
	TLocationMessage,
	TTextMessage,
} from '../types/whatsapp/activity';

export default class {
	private that!: any;
	constructor(that: any) {
		this.that = that;
	}

	public async initActivity(): Promise<TActivity> {
		const { data, body } = this.providerExtractor();

		const type = data.type;

		const schemaActivity:
			| TActivity
			| TTextMessage
			| TImageMessage
			| TDocumentMessage
			| TInteractiveMessage
			| TLocationMessage = {
			from: data.from,
			message: body,
			userProfileName: '',
			type: '',
			text: '',
			document: {
				id: '',
				byteContent: Buffer.from(''),
				mimeType: '',
				sha256: '',
			},
			location: {
				latitude: '',
				longitude: '',
			},
			image: {
				id: '',
				byteContent: Buffer.from(''),
				mimeType: '',
				sha256: '',
			},
			value: {
				id: '',
				payload: '',
				text: '',
			},
			flow: {
				isFlow: null,
				responseJson: null,
			},
			isCxperiumMessage: false,
		};

		schemaActivity.userProfileName = body.contacts[0].profile.name;

		if (type == 'text') {
			schemaActivity.text = data.text.body;
			schemaActivity.type = 'text';
		} else if (type == 'interactive') {
			schemaActivity.type = 'interactive';
			if (data.interactive.nfm_reply) {
				schemaActivity.flow.isFlow = true;
				schemaActivity.flow.responseJson = JSON.parse(
					data.interactive.nfm_reply.response_json,
				);
			} else if (data.interactive?.button_reply?.payload) {
				schemaActivity.value = data.interactive.button_reply.payload;
			} else {
				schemaActivity.value = data.interactive.list_reply
					? data.interactive.list_reply
					: data.interactive.button_reply;
			}
		} else if (type == 'image') {
			schemaActivity.type = 'image';
			schemaActivity.image.id = data.image.id;
			schemaActivity.image.mimeType = data.image.mime_type;
			schemaActivity.image.sha256 = data.image.sha256;
			schemaActivity.image.byteContent =
				await this.that.services.whatsapp.media.getMediaWithId(
					data.image.id,
					data.image.mime_type,
				);
		} else if (type == 'document') {
			schemaActivity.type = 'document';
			schemaActivity.document.id = data.document.id;
			schemaActivity.document.mimeType = data.document.mime_type;
			schemaActivity.document.sha256 = data.document.sha256;
			schemaActivity.document.byteContent =
				await this.that.services.whatsapp.media.getMediaWithId(
					data.document.id,
					data.document.mime_type,
				);
		} else if (type == 'location') {
			schemaActivity.type = 'location';
			schemaActivity.location.latitude = data.location.latitude;
			schemaActivity.location.longitude = data.location.longitude;
		}

		this.that.activity = schemaActivity;

		return this.that.activity;
	}

	public activityToText(): string {
		if (this.that.activity?.text) return this.that.activity?.text;
		else if (this.that.activity?.value) return this.that.activity?.value.id;

		throw new Error('Activity problem occurred, text and value is null');
	}

	public initCxperiumMessage(): void {
		const { data } = this.providerExtractor();

		const type = data.type;

		if (type === 'interactive' || type === 'button') {
			if (data.interactive?.button_reply || data?.button?.payload) {
				let msg = '';
				if (data?.button?.payload) {
					msg = data.button.payload;
					this.that.activity.value.id = data.button.payload;
				} else if (data?.interactive?.button_reply?.id)
					msg = data.interactive.button_reply.id;

				if (msg.includes('pollbot_') || msg.includes('SID:'))
					this.that.activity.isCxperiumMessage = true;
			}
			if (data?.interactive?.list_reply) {
				const msg: string = data.interactive.list_reply.id;

				if (msg.includes('SID:'))
					this.that.activity.isCxperiumMessage = true;
			}
			this.that.activity.type = 'interactive';
		}

		if (
			this.that.conversation.lastMessage &&
			this.that.conversation.lastMessage.includes('SID:')
		)
			this.that.activity.isCxperiumMessage = true;
	}

	public providerExtractor(): any {
		const wabaDataBody = this.that.req.body;
		const cloudApiDataBody =
			this.that.req.body?.entry?.[0].changes?.[0].value;

		let body: any;

		if (wabaDataBody?.object == 'whatsapp_business_account')
			body = cloudApiDataBody;
		else body = wabaDataBody;

		const data = body.messages?.[0];

		if (!data) throw new Error('Request data is null!');

		return { data, body };
	}
}
