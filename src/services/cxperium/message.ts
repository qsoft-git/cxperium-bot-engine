// Node modules.
import fetch from 'node-fetch';

// Services.
import ServiceCxperium from '.';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';

export default class extends ServiceCxperium {
	constructor(data: TCxperiumServiceParams) {
		super(data);
	}

	async AssignChatToTeam(chatId: string, teamId: string) {
		await fetch(
			`${this.baseUrl}/api/chat/team-change/${chatId}/${teamId}`,
			{
				method: 'PATCH',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		);
	}

	async CheckBusinessHour(): Promise<boolean> {
		const response = (await fetch(`${this.baseUrl}/api/business-hours`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;
		if (response.data.featureEnabled) return response.data.status;
		else return true;
	}

	async GetOutsideBusinessHoursMessage(cultureCode: string): Promise<string> {
		const response = (await fetch(`${this.baseUrl}/api/business-hours`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
		}).then((response) => response.json())) as any;

		return response.data.message.cultureCode;
	}

	async RedirectWpMessage(message: object) {
		try {
			const response = await fetch('', {
				method: 'POST',
				body: JSON.stringify(message),
			});
		} catch (error) {
			throw new Error('');
		}
	}

	// public static string SendNormalMessage(string message, string contactId)
	// {
	//     var client = Init.GetCxPeriumClient();
	//     var body = new ExpandoObject() as IDictionary<string, object>;

	//     body.Add("message", message);
	//     body.Add("contactId", contactId);

	//     var request = new RestRequest($"/api/chat/send-message", DataFormat.Json).AddJsonBody(
	//         body
	//     );
	//     var response = client.Post(request);

	//     dynamic obj = JsonConvert.DeserializeObject(response.Content);

	//     return obj["data"].ToString();
	// }

	// public static void SendMessageWithChatId(string chatId, string message, string contactId)
	// {
	//     var client = Init.GetCxPeriumClient();
	//     var body = new ExpandoObject() as IDictionary<string, object>;

	//     body.Add("message", message);
	//     body.Add("contactId", contactId);

	//     var request = new RestRequest(
	//         $"/api/chat/send-message/{chatId}",
	//         DataFormat.Json
	//     ).AddJsonBody(body);
	//     client.Post(request);
	// }

	// public static void SendWhatsappMessage(string chatId, string message, string phone)
	// {
	//     var client = Init.GetCxPeriumClient();
	//     JObject bodyJson = new() { ["message"] = new JObject(), ["phone"]=phone };
	//     bodyJson["message"]["text"] = message;

	//     var request = new RestRequest(
	//         $"api/chat/send-message/phone/{chatId}",
	//         DataFormat.Json
	//     ).AddJsonBody(bodyJson.ToString());

	//     QLogger.Instance.Info(bodyJson.ToString());

	//     var response = client.Post(request);
	// }

	// public static void SendWhatsappMessage(
	//     string chatId,
	//     string message,
	//     string phone,
	//     string base64Content,
	//     string filename,
	//     string type
	// )
	// {
	//     var client = Init.GetCxPeriumClient();
	//     var body = new ExpandoObject() as IDictionary<string, object>;

	//     body.Add("message", new { text = message });

	//     body.Add("phone", phone);

	//     body.Add(
	//         "media",
	//         new
	//         {
	//             data = new
	//             {
	//                 url = base64Content,
	//                 filename,
	//                 type
	//             }
	//         }
	//     );

	//     var request = new RestRequest(
	//         $"api/chat/send-message/phone/{chatId}",
	//         DataFormat.Json
	//     ).AddJsonBody(body);
	//     _ = client.Post(request);
	// }
}
