// Environment.
const { NODE_ENV } = process.env;

// Node modules.
import * as fs from 'fs';
import * as path from 'path';

export default class {
	private folderPath!: string;
	public listAll!: string[];

	constructor(_dialogPath: string) {
		this.folderPath = _dialogPath;
		this.initList();
	}

	public async run({
		dialogPath,
		appServices,
		reqServices,
	}: {
		dialogPath: string;
		activity: any;
		appServices: any;
		reqServices: any;
	}): Promise<any> {
		const filePath = path.join(this.folderPath, dialogPath);
		const dialogImport = await import(filePath);

		const dialog = new dialogImport.default({
			dialogPath,
			appServices,
			reqServices,
		});

		dialog.runDialog();
	}

	public initList(): void {
		let data: any;

		data = listFilesAndFolders(this.folderPath);

		data = catchFileExtension(data);

		data = replaceFullPath(data, this.folderPath);

		this.listAll = data;

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
