export default class API {
	static async convert(from, to, amount) {
		const result = await fetch(
			`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
		)
		return (await result.json()).result
	}
}
