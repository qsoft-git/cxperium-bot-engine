export type User = {
	userPrincipalName: string;
	displayName: string;
	mail: string;
	givenName: string;
	surname: string;

	id: string;
	name: string;
	email: string;
	phone: string;
	adName: string;
	userType: string;
	userRole: string;
	createdAt: Date;
	registerNumber: string;
	identityNumber: string;
	isApproved: boolean;
	extraFields: Record<string, string>;
};
