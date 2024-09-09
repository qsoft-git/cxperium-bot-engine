// Fetch Retry.
import fetchRetry from '../fetch';

// Services.
import ServiceCxperium from '.';

// Types.
import { TCxperiumServiceParams } from '../../types/cxperium/service';
import { TShoppingCart } from '../../types/cxperium/shopping-cart';

export default class extends ServiceCxperium {
	constructor(data: TCxperiumServiceParams) {
		super(data);
	}

	async isShoppingCartExists(cartKey: string): Promise<boolean> {
		const response: any = await fetchRetry(
			`${this.baseUrl}/api/assistant/shopping-carts/${cartKey}`,
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json());

		const shoppingCart = response.data as TShoppingCart[];

		if (shoppingCart.length > 0) return true;
		else return false;
	}

	async getShoppingCartsByKey(cartKey: string): Promise<TShoppingCart[]> {
		const response: any = await fetchRetry(
			`${this.baseUrl}/api/assistant/shopping-carts/${cartKey}`,
			{
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					apikey: this.apiKey,
				},
			},
		).then((response) => response.json());

		const shoppingCart = response.data as TShoppingCart[];

		return shoppingCart;
	}

	async addOrUpdateItemInShoppingCart(
		cartKey: string,
		contactId: string,
		productCode: string | null,
		quantity: number | null,
		unitPrice: string | null,
	): Promise<void> {
		const body: Record<string, any> = {
			cartKey,
			customerId: contactId,
		};

		if (productCode) body['productCode'] = productCode;
		if (quantity) body['quantity'] = quantity;
		if (unitPrice) body['unitPrice'] = unitPrice;

		await fetchRetry(`${this.baseUrl}/api/assistant/shopping-carts`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
			body: JSON.stringify(body),
		}).then((response) => response.json());
	}

	async approveOrder(cartKey: string, contactId: string) {
		await fetchRetry(`${this.baseUrl}/api/assistant/shopping-carts`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json',
				apikey: this.apiKey,
			},
			body: JSON.stringify({
				cartKey,
				customerId: contactId,
				approveDate: new Date(),
			}),
		}).then((response) => response.json());
	}
}
