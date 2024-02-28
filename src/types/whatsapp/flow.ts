export type TFlowMessage = {
	recipient_type: 'individual';
	to: string;
	type: 'interactive';
	interactive: {
		type: 'flow';
		header: {
			text: string | null;
		};
		body: {
			text: string;
		};
		footer: {
			text: string | null;
		};
		action: {
			name: 'flow';
			parameters: {
				flow_message_version: '3';
				flow_token: string;
				flow_id: string;
				flow_cta: string;
				flow_action: string;
				flow_action_payload: {
					screen: string;
					data?: object | null | undefined;
				};
			};
		};
	};
};
