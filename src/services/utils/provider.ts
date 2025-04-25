const isValidNumber = (input: string): boolean => {
	const regex = /^\d{15}$/;
	return regex.test(input);
};

const checkAccessToken = async (token: string): Promise<boolean> => {
	const response = await fetch('https://graph.facebook.com', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (response?.status == 401 || response?.statusText === 'Unauthorized') {
		return false;
	}

	return true;
};

export { isValidNumber /*, checkAccessToken*/ };
