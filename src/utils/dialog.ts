// Environment.
const { NODE_ENV } = process.env;

// Node modules.
import * as fs from 'fs';
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

	public async catchDialog(file: string): Promise<any> {
		return await import(path.join(this.dialogPath, file));
	}

	public initDialogList(): void {
		let data: any;

		data = listFilesAndFolders(this.dialogPath);

		data = catchFileExtension(data);

		data = replaceFullPath(data, this.dialogPath);

		this.dialogList = data;

		function replaceFullPath(array: string[], dialogPath: string): any {
			return array.map((file: string) => {
				const newFileArray = [];
				const filePathReplace = file.replace(dialogPath, '');
				const pathDirection = String(process.platform).startsWith('win')
					? '\\'
					: '/';

				const filePathReplaceArray =
					filePathReplace.split(pathDirection);

				for (const index in filePathReplaceArray) {
					const element = filePathReplaceArray[index];
					const elementExtname = path.extname(element);
					const elementReplaceDeleteExtname = element.replace(
						elementExtname,
						'',
					);

					if (elementReplaceDeleteExtname) {
						newFileArray.push(
							elementReplaceDeleteExtname.toLocaleUpperCase(
								'en-US',
							),
						);
					}
				}
				return {
					path: filePathReplace.slice(1),
					name: newFileArray.join('.'),
				};
			});
		}

		function catchFileExtension(array: string[]): string[] {
			const catchFileExtension =
				NODE_ENV === 'development' ? '.ts' : '.js';
			const filterData: string[] = [];

			for (const file of array) {
				const fileExtension = path.extname(file);

				if (fileExtension === catchFileExtension) {
					filterData.push(file);
				}
			}

			return filterData;
		}

		function listFilesAndFolders(dirPath: string): string[] {
			let results: string[] = [];

			const list = fs.readdirSync(dirPath);

			list.forEach(function (file) {
				file = path.join(dirPath, file);

				const stat = fs.statSync(file);

				if (stat && stat.isDirectory()) {
					results = results.concat(listFilesAndFolders(file));
				} else {
					results.push(file);
				}
			});

			return results;
		}
	}
}
