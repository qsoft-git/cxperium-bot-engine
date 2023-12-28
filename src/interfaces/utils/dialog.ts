// Interfaces.
import { SrcIndexConfig } from '../src-index';

export interface IUtilsDialog {
	dialogPath: string;
	initDialogProperties: (data: SrcIndexConfig) => void;
	catchDialog(file: string): Promise<any>;
	initDialog(): string[];
}
