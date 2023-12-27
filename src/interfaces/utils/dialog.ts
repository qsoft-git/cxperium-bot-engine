export interface IUtilsDialog {
	dialogPath: string;
	catchDialog(file: string): Promise<any>;
	initDialog(): string[];
}
