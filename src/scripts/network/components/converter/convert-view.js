export default class ConvertorView {
	constructor(container) {
		this.fromInput = container.querySelector('.input-from')
		this.toInput = container.querySelector('.input-to')
	}
	setFrom(value) {
		this.fromInput.value = value
	}
	setTo(value) {
		this.toInput.value = value
	}
	activateButton(button) {
		button.classList.add('active-button')
	}
	disableButton(button) {
		button.classList.remove('active-button')
	}
	setFromRate() {}
	setToRate() {}
}
