// Types.
import { IDialog, ServiceBaseDialog, TBaseDialogCtor } from '../../../..';

export default class extends ServiceBaseDialog implements IDialog {
	private WAIT_TICKET_RESPONSE = 'WAIT_TICKET_RESPONSE';

	constructor(data: TBaseDialogCtor) {
		super(data);
	}

	async runDialog(): Promise<void> {
		if (
			this.conversation.isWaitAction(
				`TicketResponse-${this.WAIT_TICKET_RESPONSE}`,
			)
		) {
			const message: string = this.activity.text;
			const ticketId: any = this.conversation.getData('ticketId');

			await this.services.cxperium.ticket.comment(ticketId, message);
			await this.services.whatsapp.message.sendRegularMessage(
				this.contact.phone,
				await this.services.cxperium.language.getLanguageByKey(
					this.conversation.conversation.languageId,
					'successfuly_ticket_response',
				),
			);

			this.conversation.resetConversation();
		}
	}

	public async RunDialogByTicketId(ticketId: string): Promise<void> {
		this.conversation.putData({ ticketId: ticketId });
		await this.services.whatsapp.message.sendRegularMessage(
			this.contact.phone,
			await this.services.cxperium.language.getLanguageByKey(
				this.conversation.conversation.languageId,
				'reply_ticket_response',
			),
		);

		this.conversation.addWaitAction(
			`TicketResponse-${this.WAIT_TICKET_RESPONSE}`,
		);
	}
}
