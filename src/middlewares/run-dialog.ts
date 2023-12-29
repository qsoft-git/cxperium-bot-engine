// Node modules.
import { Request, Response } from 'express';

// Services.
export default class {
	public static async execute(req: Request, res: Response): Promise<void> {
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

			serviceDialog
				.run({
					dialogPath: findOneDialog.path,
					appServices: res.app.locals.service,
					reqServices: res.locals.service,
				})
				.then(() => {})
				.catch((error: any) => console.log(error));
		}

		res.send();
	}
}
