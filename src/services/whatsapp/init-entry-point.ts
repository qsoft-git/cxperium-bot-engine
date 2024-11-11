// ? Helpers.
import Logger from '../../helpers/winston-loki';

export default async (dialog: any) => {
	try {
		// Init custom needs dialog.
		await dialog.services.dialog.runWithIntentName(
			dialog,
			'CXPerium.Dialogs.WhatsApp.Entry',
		);
	} catch (error: any) {
		if (error?.message === 'end') {
			throw new Error('end');
		}

		console.error(error);
		Logger?.instance?.logger?.error(error.message);
	}
};
