// Node modules.
import { Request, Response } from 'express';

// Types.
import { TBaseDialogCtor } from '../types/base-dialog';

// Services.
export default class {
	public static async execute(req: Request, res: Response): Promise<void> {
		res.send();
		try {
			const activity = res.locals.activity;
			const contact = res.locals.contact;
			const conversation = res.locals.conversation;

			const serviceCxperiumIntent =
				res.app.locals.service.cxperium.intent;
			const serviceDialog = res.app.locals.service.dialog;

			const text = activity.text;

			const cxperiumAllIntents =
				serviceCxperiumIntent.cache.get('all-intents');

			const intent = cxperiumAllIntents.find((item: any) =>
				new RegExp(item.regexValue).test(text),
			);

			if (intent) {
				const intentName = intent.name;

				const findAllDialogs = await serviceDialog.getListAll;

				const findOneDialog = findAllDialogs.find(
					(item: any) => intentName === item?.name,
				);

				const runParams: TBaseDialogCtor = {
					contact: contact,
					activity: activity,
					conversation: conversation,
					dialogPath: findOneDialog.path,
					services: res.app.locals.service,
				};

				serviceDialog
					.run(runParams)
					.then(() => {})
					.catch((error: any) => console.log(error));
			}
		} catch (error) {
			console.error(error);
		}
	}
}
