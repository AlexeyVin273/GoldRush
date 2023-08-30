import {Bets} from './bets';
import {Slots} from './slots';

const stats = {
  stars: 0,
  maxStars: 0,
  coins: 0,
  bets: 0,
  isSpinMade: false,
  isGameStarted: false,
  startSpeed: 100,
  maxSpeed: 30,
  acceleration: 5,
  winFrequency: 3,
};

export class Playground {
  constructor(container) {
    this.container = container;
  }

  init() {
    if (!this.container) {
      return;
    }

    this.starsNumber = this.container.querySelector('.playground__stars-number');
    this.coinsNumber = this.container.querySelector('.playground__coins-number');
    this.autoButton = this.container.querySelector('.playground__auto-btn');
    this.spinButton = this.container.querySelector('.playground__spin-btn');
    this.winWord = this.container.querySelector('.playground__winning-text');
    this.wonSumm = this.container.querySelector('.playground__winning-summ');

    const starsNumber = this.starsNumber.textContent;
    stats.stars = Number(starsNumber.substring(0, starsNumber.indexOf('/')));
    stats.maxStars = Number(starsNumber.substring(starsNumber.indexOf('/') + 1));
    stats.coins = Number(this.coinsNumber.textContent);

    this.bets = new Bets(this.container, {
      maxValue: Number(stats.coins),
    });

    this.slots = new Slots(this.container);

    this.onAutoButtonClick = this.onAutoButtonClick.bind(this);
    this.onSpinButtonClick = this.onSpinButtonClick.bind(this);
    this.onSlotsFinished = this.onSlotsFinished.bind(this);

    this.autoButton.addEventListener('click', this.onAutoButtonClick);
    this.spinButton.addEventListener('click', this.onSpinButtonClick);
    this.container.addEventListener('onslotsfinished', this.onSlotsFinished);

    this.disableButton(this.autoButton);
  }

  writeOffCoins(coins) {
    stats.coins -= coins;
    stats.coins = stats.coins < 0 ? 0 : stats.coins;
    this.coinsNumber.textContent = stats.coins;
  }

  accrueCoins(coins) {
    stats.coins += coins;
    this.coinsNumber.textContent = stats.coins;
  }

  onAutoButtonClick() {
    if (stats.isGameStarted) {
      this.slots.stop();
      return;
    }

    stats.isGameStarted = true;
    this.bets.disable();
    this.disableButton(this.spinButton);

    this.slots.start(stats);
  }

  onSpinButtonClick() {
    if (stats.isGameStarted) {
      return;
    }

    if (!stats.isSpinMade) {
      stats.stars += 100;
      stats.stars = stats.stars > stats.maxStars ? stats.maxStars : stats.stars;
      this.starsNumber.textContent = `${stats.stars}/${stats.maxStars}`;
    }

    const newBets = this.bets.get();
    this.writeOffCoins(newBets - stats.bets);
    stats.bets = newBets;

    stats.isSpinMade = true;
    this.enableButton(this.autoButton);
    this.hideWinnings();
  }

  onSlotsFinished(evt) {
    this.enableButton(this.spinButton);
    this.disableButton(this.autoButton);
    this.bets.enable();

    if (evt.detail.isWinner) {
      const winnings = stats.bets * 5;
      this.showWinnings(winnings);
      this.accrueCoins(winnings);
      setTimeout(() => {
        this.hideWinnings();
      }, 10000);
    }

    stats.bets = 0;
    stats.isGameStarted = false;
    stats.isSpinMade = false;
  }

  disableButton(button) {
    button.setAttribute('disabled', '');
  }

  enableButton(button) {
    button.removeAttribute('disabled');
  }

  hideWinnings() {
    this.winWord.classList.remove('is-shown');
    this.wonSumm.classList.remove('is-shown');
    this.wonSumm.textContent = '0,000';
  }

  showWinnings(coins) {
    this.winWord.classList.add('is-shown');
    this.wonSumm.classList.add('is-shown');
    this.wonSumm.textContent = coins;
  }
}
