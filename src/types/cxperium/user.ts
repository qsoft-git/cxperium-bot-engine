type User = {
	_id: string;
	firstname: string;
	lastname: string;
	email: string;
	phone: string;
	status: boolean;
};

export type UserResponse = {
	data: User[];
};
