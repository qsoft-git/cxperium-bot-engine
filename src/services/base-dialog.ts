export default class {
	private name: string;
	private description: string;

	constructor({
		name: _name,
		description: _description,
	}: {
		name: string;
		description: string;
	}) {
		this.name = _name;
		this.description = _description;
	}

	public get getName(): string {
		return this.name;
	}

	public get getDescription(): string {
		return this.description;
	}
}
