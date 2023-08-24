const MAX_BETS_VALUE = 50000;

export class Bets {
  constructor(parent, options) {
    this.parent = parent;

    this.init(options);
  }

  init(options) {
    if (!this.parent) {
      return;
    }

    this.betsEl = this.parent.querySelector('.bets');
    this.minusBtn = this.betsEl.querySelector('.bets__minus');
    this.plusBtn = this.betsEl.querySelector('.bets__plus');
    this.value = this.betsEl.querySelector('.bets__value');
    this.valueInput = this.betsEl.querySelector('.bets__input');

    this.setMaxValue(options.maxValue || MAX_BETS_VALUE);

    this.onPlusBtnMouseDown = this.onPlusBtnMouseDown.bind(this);
    this.onPlusBtnMouseUp = this.onPlusBtnMouseUp.bind(this);
    this.onMinusBtnMouseDown = this.onMinusBtnMouseDown.bind(this);
    this.onMinusBtnMouseUp = this.onMinusBtnMouseUp.bind(this);
    this.onValueKeyDown = this.onValueKeyDown.bind(this);

    this.plusBtn.addEventListener('mousedown', this.onPlusBtnMouseDown);
    this.plusBtn.addEventListener('mouseup', this.onPlusBtnMouseUp);
    this.minusBtn.addEventListener('mousedown', this.onMinusBtnMouseDown);
    this.minusBtn.addEventListener('mouseup', this.onMinusBtnMouseUp);
    this.valueInput.addEventListener('keydown', this.onValueKeyDown);
  }

  get() {
    return this.value.textContent;
  }

  set(newValue) {
    if (this.isDisabled) {
      return;
    }

    if (newValue > this.maxValue) {
      newValue = this.maxValue;
    } else if (newValue < 0) {
      newValue = 0;
    }

    this.value.textContent = newValue;
  }

  setMaxValue(maxValue) {
    this.maxValue = maxValue > MAX_BETS_VALUE ? MAX_BETS_VALUE : maxValue;

    if (Number(this.value.textContent) > this.maxValue) {
      this.set(this.maxValue);
    }
  }

  increment(_this = this, step = 1) {
    _this.set(Number(_this.value.textContent) + step);
  }

  decrement(_this = this, step = 1) {
    _this.set(Number(_this.value.textContent) - step);
  }

  disable() {
    this.isDisabled = true;
  }

  eneble() {
    this.isDisabled = false;
  }

  startCounter(valueChanger, counter = 0, step = 1) {
    let timer = 200;
    if (counter > 15) {
      timer /= Math.floor(counter / 15) * 2;
      step += Math.floor(counter / (100 * step));
    }
    if (!this.deactivateCounter) {
      setTimeout(() => {
        counter++;
        valueChanger(this, step);
        this.startCounter(valueChanger, counter, step);
      }, timer);
    }
  }

  onPlusBtnMouseDown() {
    this.deactivateCounter = false;
    this.startCounter(this.increment);
  }

  onPlusBtnMouseUp() {
    this.deactivateCounter = true;
  }

  onMinusBtnMouseDown() {
    this.deactivateCounter = false;
    this.startCounter(this.decrement);
  }

  onMinusBtnMouseUp() {
    this.deactivateCounter = true;
  }

  onValueKeyDown(evt) {
    evt.preventDefault();
    const oldValue = this.value.textContent;
    if (evt.key >= '0' && evt.key <= '9') {
      const newValue = oldValue + evt.key;
      if (newValue <= this.maxValue) {
        this.set(Number(newValue));
      }
    }

    if (evt.key === 'Backspace') {
      this.set(Number(oldValue.substr(0, oldValue.length - 1)));
    }
  }
}
