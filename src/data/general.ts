import NodeCache from 'node-cache';

const { BASE_CXPERIUM_URL } = process.env;

// Variables.
const data: {
	name: string;
	cxperiumBaseUrl: string;
	version: string;
	cache: NodeCache;
} = {
	name: '',
	version: '',
	cxperiumBaseUrl: BASE_CXPERIUM_URL || 'https://api.cxperium.com',
	cache: new NodeCache(),
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

	get cache(): NodeCache {
		return data.cache;
	},
};
