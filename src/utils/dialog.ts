// Node modules.
import * as path from 'path';

// Services.
import ServiceDialog from '../services/dialog';

// Interfaces.
import { IUtilsDialog } from '../interfaces/utils/dialog';
import { ISrcIndexConfig } from '../interfaces/src-index';

export class UtilDialog implements IUtilsDialog {
	dialogPath!: string;
	serviceDialog!: ServiceDialog;

	public initDialogProperties(data: ISrcIndexConfig): void {
		this.dialogPath = path.join(data.srcPath, '/', 'dialog');
	}

	public initDialogService() {
		this.serviceDialog = new ServiceDialog(this.dialogPath);
	}
}
