export type TTextMessage = {
	from: string;
	type: 'text';
	text: {
		body: string;
	};
};

export type TImageMessage = {
	from: string;
	type: 'image';
	image: {
		id: string;
		mimeType: string;
		sha256: string;
		byteContent: Buffer;
	};
};

export type TDocumentMessage = {
	from: string;
	type: 'document';
	document: {
		id: string;
		mimeType: string;
		sha256: string;
		byteContent: Buffer;
	};
};

export type TInteractiveMessage = {
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

export type TActivity = {
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
	isCxperiumMessage: boolean;
};
