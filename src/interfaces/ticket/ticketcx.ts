export interface TicketCx {
	id?: string;
	userId?: string;
	taskId?: string;
	status?: string;
	subject?: string;
	mediaName?: Medianame[];
	contactId?: string;
	priorty?: string;
	delete?: boolean;
	message?: string;
	audit?: Audit[];
	comments?: any[];
	tags?: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface Medianame {
	link?: string;
	format?: string;
}

interface Audit {
	requesterUserId?: string;
	date?: Date;
	requesterUserType?: string;
	process?: string;
	place?: string;
	contactId?: string;
}
