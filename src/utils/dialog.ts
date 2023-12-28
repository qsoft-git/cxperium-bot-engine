// Environment.
const { NODE_ENV } = process.env;

// Node modules.
import * as fs from 'fs';
import * as path from 'path';

// Interfaces.
import { IUtilsDialog } from '../interfaces/utils/dialog';
import { SrcIndexConfig } from '../interfaces/src-index';

// Export default module.
export class UtilDialog implements IUtilsDialog {
	dialogPath!: string;

	public initDialogProperties(data: SrcIndexConfig): void {
		this.dialogPath = path.join(data.srcPath, '/', 'dialog');
	}

	public async catchDialog(file: string): Promise<any> {
		return await import(path.join(this.dialogPath, file));
	}

	public initDialog(): string[] {
		let filterFindFiles: string[] = [];
		const findFiles = fs.readdirSync(this.dialogPath);
		const catchFileExtension = NODE_ENV === 'development' ? '.ts' : '.js';

		if (findFiles.length > 0) {
			filterFindFiles = findFiles.filter((file) => {
				const fileExtension = path.extname(file);
				return fileExtension === catchFileExtension;
			});
		}

		return filterFindFiles;
	}
}
