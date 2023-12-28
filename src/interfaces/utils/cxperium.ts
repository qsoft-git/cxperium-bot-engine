// Interfaces.
import { SrcIndexConfig } from '../src-index';

export interface IUtilsCxperium {
	apiKey: string;
	callbackUrl: string;
	initCxperiumProperties: (data: SrcIndexConfig) => void;
}
