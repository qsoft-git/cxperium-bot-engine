// Interfaces.
import { ISrcIndexConfig } from '../src-index';

export interface IUtilsDialog {
	dialogPath: string;
	initDialogProperties: (data: ISrcIndexConfig) => void;
	catchDialog(file: string): Promise<any>;
	initDialogList(): void;
}
