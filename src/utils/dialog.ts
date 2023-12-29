// Node modules.
import * as path from 'path';

// Services.
import ServiceDialog from '../services/dialog';

// Interfaces.
import { IUtilsDialog } from '../interfaces/utils/dialog';

// Types.
import { TSrcIndexConfig } from '../types/src-index';

export class UtilDialog implements IUtilsDialog {
	dialogPath!: string;
	serviceDialog!: ServiceDialog;

	public initDialogProperties(data: TSrcIndexConfig): void {
		this.dialogPath = path.join(data.srcPath, '/', 'dialogs');
	}

	public initDialogService() {
		this.serviceDialog = new ServiceDialog(this.dialogPath);
	}
}
