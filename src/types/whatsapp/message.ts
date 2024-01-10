type TWpInteractiveButtonMessage = {
	recipient_type: 'individual';
	to: string;
	type: 'interactive';
	interactive: {
		type: 'button';
		header: {
			type: string;
			text: string;
		};
		body: {
			text: string;
		};
		footer: {
			text: string;
		};
		action: TButtonAction;
	};
};

type TWpInteractiveListMessage = {
	recipient_type: 'individual';
	to: string;
	type: 'interactive';
	interactive: {
		type: 'list';
		header: {
			type: string;
			text: string;
		};
		body: {
			text: string;
		};
		footer: {
			text: string;
		};
		action: TListAction;
	};
};

type TButtonAction = {
	buttons: TDefaultButton[];
};

type TListAction = {
	button: string;
	sections: TSection[];
};

type TDefaultButton = {
	type: string;
	reply: {
		id: string;
		title: string;
	};
};

type TButton = {
	id: string;
	title: string;
};

type TSection = {
	title: string;
	rows: TRow[];
};

type TRow = {
	id: string;
	title: string;
	description: string;
};

export {
	TButton,
	TDefaultButton,
	TRow,
	TWpInteractiveListMessage,
	TWpInteractiveButtonMessage,
	TSection,
	TButtonAction,
	TListAction,
};
