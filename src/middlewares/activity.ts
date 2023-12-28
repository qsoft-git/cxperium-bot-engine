import { Request, Response, NextFunction } from 'express';
type TextMessage = {
	from: string;
	type: 'text';
	text: {
		body: string;
	};
};

type ImageMessage = {
	from: string;
	type: 'image';
	image: {
		id: string;
		mimeType: string;
		sha256: string;
		byteContent: Buffer;
	};
};

type DocumentMessage = {
	from: string;
	type: 'document';
	document: {
		id: string;
		mimeType: string;
		sha256: string;
		byteContent: Buffer;
	};
};

type InteractiveMessage = {
	from: string;
	type: 'interactive';
	interactive: {
		list_reply: {
			id: string;
			text: string;
		};
		button_reply: {
			id: string;
			text: string;
		};
	};
};

type Activity = {
	from: string;
	type: string;
	text: string;
	document: {
		id: string;
		byteContent: Buffer;
		mimeType: string;
		sha256: string;
	};
	image: {
		id: string;
		byteContent: Buffer;
		mimeType: string;
		sha256: string;
	};
	value: {
		id: string;
		text: string;
	};
};

export default class {
	public static execute(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		const data = req.body.message[0];
		const type = data.type;

		const activity = {
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
	}
}
