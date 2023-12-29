// Environment.
const { NODE_ENV } = process.env;

// Node modules.
import * as fs from 'fs';
import * as path from 'path';

// Types.
import { TBaseDialogCtor } from '../types/base-dialog';

// Constants.
const listAll: { name: string; path: string }[] = [];

export default class {
	private folderPathExternal!: string;
	private folderPathInternal!: string;

	constructor(_dialogPath: string) {
		this.folderPathExternal = _dialogPath;
		this.folderPathInternal = path.join(__dirname, '../dialogs');
		this.initList(this.folderPathExternal, 'EXTERNAL');
		this.initList(this.folderPathInternal, 'INTERNAL');
	}

	public get getListAll() {
		return listAll;
	}

	public async run(data: TBaseDialogCtor): Promise<any> {
		const dialogImport = await import(data.dialogPath);

		const dialog = new dialogImport.default(data);
		dialog.runDialog();
	}

	public initList(folderPath: string, type: string): void {
		let data: any;

		data = listFilesAndFolders(folderPath);

		data = catchFileExtension(data);

		data = replaceFullPath(data, folderPath);

		listAll.push(...data);

		function replaceFullPath(array: string[], dialogPath: string): any {
			return array.map((file: string) => {
				const newFileArray = ['CXPerium.Dialogs'];
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
						newFileArray.push(elementReplaceDeleteExtname);
					}
				}
				return {
					path: file,
					name: newFileArray.join('.'),
				};
			});
		}

		function catchFileExtension(array: string[]): string[] {
			const catchFileExtension =
				NODE_ENV === 'development' && type == 'EXTERNAL'
					? '.ts'
					: '.js';
			const filterData: string[] = [];

			for (const file of array) {
				const fileBase = path.basename(file);
				const fileExtension = path.extname(fileBase);
				const fileExtensionDotControl = fileBase.split('.').length;

				if (
					fileExtension === catchFileExtension &&
					fileExtensionDotControl === 2
				) {
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
