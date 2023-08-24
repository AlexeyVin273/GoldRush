export class Slots {
  constructor(parent) {
    this.parent = parent;

    this.init();
  }

  init() {
    if (!this.parent) {
      return;
    }

    this.slotsEl = this.parent.querySelector('.slot');
    this.columns = Array.of(...this.slotsEl.querySelectorAll('.slot__column'));
    this.initColumns();
  }

  start() {
    this.columns.forEach((column) => this.move(column));
  }

  stop() {

  }

  initColumns() {
    this.columns.forEach((column) => {
      column.setAttribute('style', 'transform: translate3d(0, -50%, 0);');
    });
  }

  move(column) {
    column.setAttribute('style', 'transform: translate3d(0, 194px, 0); transition: transform 0.5s ease;');
  }
}
