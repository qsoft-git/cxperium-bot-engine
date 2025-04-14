type TFrom = {
	from: string;
	type: 'text' | 'location' | 'document' | 'interactive' | 'video' | 'image' | 'reaction' | 'reply';
};

export type TTextMessage = {
	text: {
		body: string;
	};
};

export type TImage = {
	id: string | null;
	mimeType: string | null;
	sha256: string | null;
	byteContent?: Buffer | null;
};

export type TLocation = {
	latitude: string | null;
	longitude: string | null;
};

export type TDocument = {
	id: string | null;
	mimeType: string | null;
	sha256: string | null;
	byteContent: Buffer | null;
};

export type TVideo = {
	id: string | null;
	mimeType: string | null;
	sha256: string | null;
	status: string | null;
	byteContent: Buffer | null;
};

export type TInteractiveMessage = TFrom & {
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

export type TActivity = TFrom & {
	message: any;
	text: string;
	userProfileName: string;
	document: TDocument;
	video: TVideo;
	image: TImage;
	location: TLocation;
	value: {
		id: string;
		payload: string;
		text: string;
	};
	flow: {
		isFlow: boolean | null;
		responseJson: object | null;
	};
	reaction: {
		message_id: string;
		emoji: string;
	}
	reply: {
		message_id: string,
		text: string
	}

	isCxperiumMessage: boolean;
};
