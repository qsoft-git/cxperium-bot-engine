// Variables.
const data: { name: string; cxperiumBaseUrl: string; version: string } = {
	name: '',
	version: '',
	cxperiumBaseUrl: 'https://api.cxperium.com',
};

export default {
	get name(): string {
		return data.name;
	},

	set name(value: string) {
		data.name = value;
	},

	get cxperiumBaseUrl(): string {
		return data.cxperiumBaseUrl;
	},

	set cxperiumBaseUrl(value: string) {
		data.cxperiumBaseUrl = value;
	},
};
