// Types.
import { TSrcIndexConfig } from '../../types/src-index';

// Services.
import ServiceDialog from '../../services/dialog';

export interface IUtilsDialog {
	dialogPath: string;
	serviceDialog: ServiceDialog;
	initDialogProperties: (data: TSrcIndexConfig) => void;
	initDialogService: () => void;
}
