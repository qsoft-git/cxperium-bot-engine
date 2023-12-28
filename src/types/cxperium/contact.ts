type CxperiumContact = {
	status: number;
	success: boolean;
	message: string;
	data: Data;
};

type Contact = {
	_id: string;
	delete: boolean;
	phone: string;
	user_id: string;
	email: string;
	tags: Tag[];
	userProfileName: string;
	custom: object;
	createdAt: Date;
	updatedAt: Date;
};

type Data = {
	data: Contact[];
};

type Tag = {
	_id: string;
	user_id: string;
	name: string;
	color: string;
	delete: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export { CxperiumContact, Contact };
