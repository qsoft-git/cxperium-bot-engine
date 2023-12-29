// Interfaces.
import { ISrcIndexConfig } from '../src-index';

export interface IUtilsDialog {
	dialogPath: string;
	dialogList: string[];
	initDialogProperties: (data: ISrcIndexConfig) => void;
}
