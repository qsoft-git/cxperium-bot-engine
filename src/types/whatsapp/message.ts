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

type TSingleProductMessage = {
	recipient_type: 'individual';
	to: string;
	type: 'interactive';
	interactive: {
		type: 'product';
		body: {
			text: string;
		};
		footer: {
			text: string | null;
		};
		action: {
			catalog_id: string;
			product_retailer_id: string;
		};
	};
};

type TMultiProductMessage = {
	messaging_product: 'whatsapp';
	recipient_type: 'individual';
	to: string;
	type: 'interactive';
	interactive: {
		type: 'product_list';
		header: {
			type: 'text';
			text: string | null;
		};
		body: {
			text: string;
		};
		footer: {
			text: string | null;
		};
		action: {
			catalog_id: string;
			sections: TMultiProductSection[];
		};
	};
};

type TMultiProductSection = {
	title: string;
	products_items: TProductItem[];
};

type TProductItem = {
	product_retailer_id: string;
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
	TMultiProductMessage,
	TSingleProductMessage,
	TMultiProductSection,
};
