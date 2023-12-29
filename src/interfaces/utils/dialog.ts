// Interfaces.
import { ISrcIndexConfig } from '../src-index';

// Services.
import ServiceDialog from '../../services/dialog';

export interface IUtilsDialog {
	dialogPath: string;
	serviceDialog: ServiceDialog;
	initDialogProperties: (data: ISrcIndexConfig) => void;
	initDialogService: () => void;
}
