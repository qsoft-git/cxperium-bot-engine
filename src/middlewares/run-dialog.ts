// Node modules.
import { Request, Response, NextFunction } from 'express';

// Services.
export default class {
	public static async execute(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const activity = res.locals.activity;
		const serviceCxperiumIntent = res.app.locals.service.cxperium.intent;
		const serviceDialog = res.app.locals.service.dialog;

		const text = activity.text;

		const cxperiumAllIntents =
			serviceCxperiumIntent.cache.get('all-intents');

		const intent = cxperiumAllIntents.find((item: any) =>
			new RegExp(item.regexValue).test(text),
		);

		if (intent) {
			const intentName = intent.name;

			const findOneDialog = serviceDialog.listAll.find(
				(item: any) => intentName === item.name,
			);

			serviceDialog.run(findOneDialog.path).then((Dialog: any) => {
				const dialog = new Dialog.default({
					name: 'Test Dialog',
					description: 'Test Dialog Description',
				});
				dialog.runDialog();
			});
		}

		res.send();
	}
}
