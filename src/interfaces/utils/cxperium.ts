// Interfaces.
import { ISrcIndexConfig } from '../src-index';

export interface IUtilsCxperium {
	apiKey: string;
	callbackUrl: string;
	initCxperiumProperties: (data: ISrcIndexConfig) => void;
}
