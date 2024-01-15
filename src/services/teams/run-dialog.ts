// Node modules.
import { Request } from 'express';

// Types.
import { TurnContext } from 'botbuilder';

// Types.
import { TAppLocalsServices } from '../../types/base-dialog';
import {
	TActivity,
	TTextMessage,
	TImageMessage,
	TDocumentMessage,
	TInteractiveMessage,
} from '../../types/whatsapp/activity';

export default class {
	private services!: TAppLocalsServices;
	private activity!:
		| TActivity
		| TTextMessage
		| TImageMessage
		| TDocumentMessage
		| TInteractiveMessage
		| any;
	private conversation!: any;
	private contact!: any;
	public place = 'TEAMS';

	constructor(
		private req: Request,
		private context: TurnContext,
	) {
		this.services = this.req.app.locals.service;
	}

	async execute(): Promise<void> {
		this.initActivity();

		// Init conversation.
		this.conversation =
			await this.services.cxperium.session.getConversationTeams(this);

		await this.services.dialog.runWithMatch(this);
	}

	initActivity(): void {
		this.activity = this.context.activity;
	}
}
