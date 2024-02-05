export default async (dialog: any) => {
	try {
		// Init custom needs dialog.
		await dialog.services.dialog.runWithIntentName(
			dialog,
			'CXPerium.Dialogs.Webchat.Entry',
		);

		await dialog.services.dialog.runWithIntentName(
			dialog,
			'CXPerium.Dialogs.Webchat.WelcomeDialog',
		);
	} catch (error: any) {
		if (error?.message === 'end') {
			throw new Error('end');
		}
		console.error(
			'Entry.ts has to be created to initialize project. Add Entry.ts class inside your channel file.',
		);
		process.exit(137);
	}
};
