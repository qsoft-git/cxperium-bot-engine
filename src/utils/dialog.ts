// Node modules.
import * as path from 'path';

// Interfaces.
import { IUtilsDialog } from '../interfaces/utils/dialog';
import { ISrcIndexConfig } from '../interfaces/src-index';

// Export default module.
export class UtilDialog implements IUtilsDialog {
	dialogPath!: string;
	dialogList!: string[];

	public initDialogProperties(data: ISrcIndexConfig): void {
		this.dialogPath = path.join(data.srcPath, '/', 'dialog');
	}
}
