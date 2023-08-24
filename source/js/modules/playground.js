import {Bets} from './bets';
import {Slots} from './slots';

const stats = {
  stars: 0,
  maxStars: 0,
  coins: 0,
  bets: 0,
  win: 0,
  isSpinMade: false,
  isGameStarted: false,
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

    this.autoButton.addEventListener('click', this.onAutoButtonClick);
    this.spinButton.addEventListener('click', this.onSpinButtonClick);
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
    if (!stats.isSpinMade) {
      alert('Ставка не сделана');
      return;
    }

    stats.isGameStarted = true;
    this.bets.disable();

    this.slots.start();
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
  }
}
