export type TCxperiumContactResponse = {
	status: number;
	success: boolean;
	message: string;
	data: TCxperiumData;
};

export type TCxperiumContact = {
	_id: string;
	delete: boolean;
	phone: string;
	user_id: string;
	email: string;
	tags: TCxperiumTag[];
	userProfileName: string;
	custom: object;
	createdAt: Date;
	updatedAt: Date;
	language?: string;
};

type TCxperiumData = {
	data: TCxperiumContact[];
};

type TCxperiumTag = {
	_id: string;
	user_id: string;
	name: string;
	color: string;
	delete: boolean;
	createdAt: Date;
	updatedAt: Date;
};
