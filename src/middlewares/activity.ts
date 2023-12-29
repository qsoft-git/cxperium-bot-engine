// Node modules.
import { Request, Response, NextFunction } from 'express';

// Types.
import {
	TActivity,
	TTextMessage,
	TImageMessage,
	TDocumentMessage,
	TInteractiveMessage,
} from '../types/activity';

export default class {
	public static execute(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		try {
			const data = req.body.messages[0];
			const type = data.type;

			const activity:
				| TActivity
				| TTextMessage
				| TImageMessage
				| TDocumentMessage
				| TInteractiveMessage = {
				from: data.from,
				type: '',
				text: '',
				document: {
					id: '',
					byteContent: new Buffer(''),
					mimeType: '',
					sha256: '',
				},
				image: {
					id: '',
					byteContent: new Buffer(''),
					mimeType: '',
					sha256: '',
				},
				value: {
					id: '',
					text: '',
				},
			};

			if (type == 'text') {
				activity.text = data.text.body;
				activity.type = 'text';
			} else if (type == 'interactive') {
				activity.type = 'interactive';
				activity.value = data.interactive.list_reply
					? data.interactive.list_reply
					: data.interactive.button_reply;
			} else if (type == 'image') {
				activity.type = 'image';
				activity.image.id = data.image.id;
				activity.image.mimeType = data.image.mimeType;
				activity.image.sha256 = data.image.sha256;
			} else if (type == 'document') {
				activity.type = 'document';
				activity.document.id = data.document.id;
				activity.document.mimeType = data.document.mimeType;
				activity.document.sha256 = data.document.sha256;
			}

			res.locals.activity = activity;
			next();
		} catch (error) {
			console.error(error);
			res.send();
		}
	}
}
