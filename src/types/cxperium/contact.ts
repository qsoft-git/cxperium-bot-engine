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
	user_id?: string;
	email: string;
	tags: TContactTag[];
	userProfileName: string;
	custom: object;
	createdAt: Date;
	updatedAt: Date;
	language?: string;
};

export type TContactTag = {
	id: string;
};

type TCxperiumData = {
	data: TCxperiumContact[];
};
