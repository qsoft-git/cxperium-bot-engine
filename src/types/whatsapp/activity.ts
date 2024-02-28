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

export type TLocationMessage = {
	from: string;
	type: 'location';
	image: {
		latitude: string;
		longitude: string;
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
	message: any;
	type: string;
	text: string;
	userProfileName: string;
	document: {
		id: string;
		byteContent: Buffer;
		mimeType: string;
		sha256: string;
	};
	location: {
		longitude: string;
		latitude: string;
	};
	image: {
		id: string;
		byteContent: Buffer;
		mimeType: string;
		sha256: string;
	};
	value: {
		id: string;
		payload: string;
		text: string;
	};
	flow: {
		isFlow: boolean | null;
		responseJson: object | null;
	};
	isCxperiumMessage: boolean;
};
