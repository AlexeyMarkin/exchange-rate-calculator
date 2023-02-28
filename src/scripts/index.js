let loading
const loadingWindow = document.querySelector('.loading')

async function convert(from, to, amount) {
	if (to === from) return [amount, 1]
	loading = setTimeout(() => {
		loadingWindow.classList.remove('hidden')
	}, 500)
	const response = await fetch(
		`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}&places=4`
	).catch(() => alert('Server Error 404'))
	clearTimeout(loading)
	loadingWindow.classList.add('hidden')
	let json = await response.json()
	return [json.result, json.info.rate]

	//response.json()) - вернул сервер  // .result - поле объекта
}

// async function convert(from, to, amount) {
//   const response =
//     await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
//   const data = await response.json();   //response.json()) - вернул сервер  // .result - поле объекта
//   return data;
// }

async function getData() {
	const response = await fetch('https://api.exchangerate.host/symbols')
	const data = await response.json()
	return Object.keys(data.symbols)
}

// getData().then((data) => {
//   // console.log(data)
//   let selector = document.querySelector('.currency-button');
//   for (let key in data.symbols) {
//     let option = document.createElement('option')
//     option.innerText = key;
//     selector.append(option);
//   }
// })

// convert("RUB", "USD", "1")
//   .then((data) => console.log(data))

function renderOptions(currency) {
	let option = document.createElement('option')
	option.innerText = currency
	option.value = currency
	return option
}

function activateButton(button, container) {
	button?.classList.add('activate-button')
}

function disableButton(button) {
	button?.classList.remove('activate-button')
}

function getActiveButton(container) {
	return container.querySelector('.activate-button')
}

function getButtonByCurrency(currency, container) {
	return (
		container.querySelector(`.currency-button[value=${currency}]`) ??
		container.querySelector(`select`)
	)
}

async function initApp(from, to, amount) {
	// console.log(getButtonByCurrency(from, fromButtonsPanel))
	const currencies = await getData() // currencies - array

	currencies.forEach((currency) => {
		fromSelect.append(renderOptions(currency))
		toSelect.append(renderOptions(currency))
	})
	let rate = undefined
	activateButton(getButtonByCurrency(from, fromButtonsPanel))
	activateButton(getButtonByCurrency(to, toButtonsPanel))
	fromInput.value = amount
	;[toInput.value, rate] = await convert(fromCurrency, toCurrency, amount)
	// setRate(fromRate, fromCurrency, toCurrency, rate)
	// setRate(toRate, toCurrency, fromCurrency, +(1 / rate).toFixed(4))
	setRates(fromCurrency, toCurrency, rate)
}

function setRates(from, to, rate) {
	setRate(fromRate, fromCurrency, toCurrency, +rate.toFixed(4))
	setRate(toRate, toCurrency, fromCurrency, +(1 / rate).toFixed(4))
}

function getRateTemplateString(from, to, rate) {
	return `1 ${from} = ${rate} ${to}`
}

function setRate(container, from, to, rate) {
	container.innerText = getRateTemplateString(from, to, rate)
}

let timer = undefined
let fromCurrency = 'RUB'
let toCurrency = 'USD'
let amount = 1

const fromPanel = document.querySelector('.from-panel')
const toPanel = document.querySelector('.to-panel')
const fromInput = fromPanel.querySelector('input')
const toInput = toPanel.querySelector('input')
const fromButtonsPanel = fromPanel.querySelector('.buttons-panel')
const toButtonsPanel = toPanel.querySelector('.buttons-panel')
const fromRate = fromPanel.querySelector('p')
const toRate = toPanel.querySelector('p')
const switchButton = document.querySelector('.switch-button')
const fromSelect = fromPanel.querySelector('select')
const toSelect = toPanel.querySelector('select')

initApp(fromCurrency, toCurrency, amount)
fromInput.addEventListener('input', (event) => {
	clearTimeout(timer)
	timer = setTimeout(async () => {
		;[toInput.value] = await convert(
			fromCurrency,
			toCurrency,
			event.target.value
		)
	}, 500)
})

toInput.addEventListener('input', (event) => {
	clearTimeout(timer)
	timer = setTimeout(async () => {
		;[fromInput.value] = await convert(
			toCurrency,
			fromCurrency,
			event.target.value
		)
	}, 500)
})

fromButtonsPanel.addEventListener('click', async (event) => {
	if (event.target.classList.contains('currency-button')) {
		disableButton(getActiveButton(fromButtonsPanel))
		activateButton(event.target)
		fromCurrency = event.target.value
		let rate
		;[toInput.value, rate] = await convert(
			fromCurrency,
			toCurrency,
			fromInput.value
		)

		setRates(fromCurrency, toCurrency, rate)
	}
})

toButtonsPanel.addEventListener('click', async (event) => {
	if (event.target.classList.contains('currency-button')) {
		disableButton(getActiveButton(toButtonsPanel))
		activateButton(event.target)
		toCurrency = event.target.value
		let rate
		;[fromInput.value, rate] = await convert(
			toCurrency,
			fromCurrency,
			toInput.value
		)
		setRates(toCurrency, fromCurrency, 1 / rate)
	}
})

switchButton.addEventListener('click', async (event) => {
	;[fromCurrency, toCurrency] = [toCurrency, fromCurrency]
	const fromActiveButton = getActiveButton(fromButtonsPanel)
	const toActiveButton = getActiveButton(toButtonsPanel)
	disableButton(fromActiveButton)
	disableButton(toActiveButton)
	activateButton(getButtonByCurrency(fromCurrency, fromButtonsPanel))
	activateButton(getButtonByCurrency(toCurrency, toButtonsPanel))
	let rate
	;[toInput.value, rate] = await convert(
		fromCurrency,
		toCurrency,
		fromInput.value
	)

	const selected = fromSelect.selectedIndex
	fromSelect.options[toSelect.selectedIndex].selected = true
	toSelect.options[selected].selected = true

	setRates(fromCurrency, toCurrency, rate)
})

fromSelect.addEventListener('change', async (event) => {
	fromCurrency = event.target.value
	let rate
	;[toInput.value, rate] = await convert(
		fromCurrency,
		toCurrency,
		fromInput.value
	)
	setRates(fromCurrency, toCurrency, rate)
	disableButton(getActiveButton(fromPanel))
	activateButton(fromSelect)
})

toSelect.addEventListener('change', async (event) => {
	toCurrency = event.target.value
	let rate
	;[fromInput.value, rate] = await convert(
		toCurrency,
		fromCurrency,
		toInput.value
	)
	setRates(toCurrency, fromCurrency, 1 / rate)
	disableButton(getActiveButton(toPanel))
	activateButton(toSelect)
})
