export default function (value: any): boolean {
	if (typeof value === 'boolean') {
		return value;
	}

	if (typeof value === 'string') {
		value = value.toLowerCase().trim();
		return value === 'true' || value === '1';
	}

	if (typeof value === 'number') {
		return value === 1;
	}

	return false;
}
