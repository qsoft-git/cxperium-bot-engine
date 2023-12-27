export default class {
	public static run(derivedCtor: any, baseCtors: any[]): void {
		baseCtors.forEach((baseCtor) => {
			Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
				if (name !== 'constructor') {
					derivedCtor.prototype[name] = baseCtor.prototype[name];
				}
			});
		});
	}
}
