// Node modules.
import * as fs from 'fs';
import * as path from 'path';

export default class {
	public static getJsonParse(): any {
		const packageJsonPath = path.join(
			__dirname,
			'..',
			'..',
			'package.json',
		);
		const jsonPackageJson = fs.readFileSync(packageJsonPath, 'utf8');
		return JSON.parse(jsonPackageJson);
	}
}
