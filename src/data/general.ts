// Variables.
const data: { name: string; version: string } = {
	name: '',
	version: '',
};

export default class {
	get name(): string {
		return data.name;
	}

	set name(value: string) {
		data.name = value;
	}
}
