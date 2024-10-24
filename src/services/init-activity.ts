import { TActivity } from '../types/whatsapp/activity';

export default class {
	private that!: any;
	constructor(that: any) {
		this.that = that;
	}

	public async initActivity(): Promise<TActivity> {
		const { data, body } = this.providerExtractor();

		const type = data.type;

		const schemaActivity: TActivity = {
			from: data.from,
			message: body,
			type: type,
			userProfileName: '',
			text: '',
			document: {
				id: null,
				byteContent: Buffer.from(''),
				mimeType: null,
				sha256: null,
			},
			video: {
				id: null,
				mime_type: null,
				sha256: null,
				status: null,
				byteContent: Buffer.from(''),
			},
			location: {
				latitude: null,
				longitude: null,
			},
			image: {
				id: null,
				byteContent: null,
				mimeType: null,
				sha256: null,
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
				if (data?.interactive?.button_reply) {
					schemaActivity.value.id =
						data?.interactive?.button_reply.id;
					schemaActivity.value.text =
						data?.interactive?.button_reply.title;
				}
				if (data?.interactive?.list_reply) {
					schemaActivity.value = data.interactive.list_reply;
				}
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
		} else if (type == 'video') {
			schemaActivity.type = 'video';
			schemaActivity.video.id = data.video.id;
			schemaActivity.video.mime_type = data.video.mime_type;
			schemaActivity.video.sha256 = data.video.sha256;
			schemaActivity.video.status = data.video.status;
			schemaActivity.video.byteContent =
				await this.that.services.whatsapp.media.getMediaWithId(
					data.video.id,
					data.video.mime_type,
				);
		}

		this.that.activity = schemaActivity;

		return this.that.activity;
	}

	public activityToText(): string {
		if (this.that.activity?.text) return this.that.activity?.text;
		else if (this.that.activity?.value) return this.that.activity?.value.id;
		else if (this.that.activity?.payload) return this.that.activity.payload;

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
		const body = this.that.req.body;

		const data = body.messages?.[0];

		if (!data) throw new Error('Request data is null!');

		return { data, body };
	}
}
