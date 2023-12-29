// Node modules.
import NodeCache from 'node-cache';

export default class UtilConfig {
	private static instance: UtilConfig;
	public cache: NodeCache;

	private constructor() {
		this.cache = new NodeCache();
	}

	public static getInstance(): UtilConfig {
		if (!UtilConfig.instance) {
			UtilConfig.instance = new UtilConfig();
		}
		return UtilConfig.instance;
	}
}
