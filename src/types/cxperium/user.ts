type TCxperiumUser = {
	_id: string;
	firstname: string;
	lastname: string;
	email: string;
	phone: string;
	status: boolean;
};

export type TCxperiumUserResponse = {
	data: TCxperiumUser[];
};
