import {resizeObserver} from '../utils/observers';

const slotImages =
  [
    {
      src: 'slot-01',
      width: '105',
      height: '65',
      size: 'small',
    },
    {
      src: 'slot-02',
      width: '105',
      height: '65',
      size: 'small',
    },
    {
      src: 'slot-03',
      width: '105',
      height: '65',
      size: 'small',
    },
    {
      src: 'slot-04',
      width: '112',
      height: '59',
      size: 'big',
    },
    {
      src: 'slot-05',
      width: '112',
      height: '59',
      size: 'big',
    },
    {
      src: 'slot-06',
      width: '112',
      height: '59',
      size: 'big',
    },
    {
      src: 'slot-07',
      width: '105',
      height: '68',
      size: 'middle',
    },
    {
      src: 'slot-08',
      width: '105',
      height: '68',
      size: 'middle',
    },
    {
      src: 'slot-09',
      width: '105',
      height: '68',
      size: 'middle',
    }
  ];

const MAX_CELLS_NUMBER = slotImages.length;

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

    this.placeCellsIntoColumns = this.placeCellsIntoColumns.bind(this);

    this.cellMap = new Map();
    slotImages.forEach((image, index) => {
      const cell = document.createElement('div');
      cell.classList.add('slot__cell');
      cell.classList.add(`slot__cell--size-${image.size}`);
      const picture = document.createElement('picture');
      const source = document.createElement('source');
      const img = document.createElement('img');
      img.setAttribute('src', `img/content/slot/${image.src}.png`);
      img.setAttribute('srcset', `img/content/slot/${image.src}@2x.png 2x`);
      img.setAttribute('width', image.width);
      img.setAttribute('height', image.height);
      img.setAttribute('alt', '');
      source.setAttribute('type', 'image/webp');
      source.setAttribute('srcset', `img/content/slot/${image.src}.webp, img/content/slot/${image.src}@2x.webp 2x`);
      picture.appendChild(source);
      picture.appendChild(img);
      cell.appendChild(picture);
      this.cellMap.set(index, cell);
    });

    this.initColumns();
    this.stopTrigger = false;
    this.isGameStarted = false;
    this.gameCounter = 0;
  }

  start(stats) {
    if (this.isGameStarted) {
      return;
    }

    if (++this.gameCounter >= stats.winFrequency) {
      this.winAnyway = true;
      this.winCell = Math.floor(Math.random() * (MAX_CELLS_NUMBER - 1));
      this.gameCounter = 0;
    } else {
      this.winAnyway = false;
    }

    this.isGameStarted = true;

    this.columns.forEach((column, index) => {
      setTimeout(() => {
        this.columnsStats[index].startSpeed = stats.startSpeed;
        this.columnsStats[index].currentSpeed = stats.startSpeed;
        this.columnsStats[index].acceleration = stats.acceleration;
        this.columnsStats[index].deceleration = -1 * Math.floor(1 + stats.acceleration * Math.random());
        this.columnsStats[index].maxSpeed = Math.floor(stats.maxSpeed + Math.random() * (stats.startSpeed - stats.maxSpeed));
        this.columnsStats[index].isActive = true;
        this.move(column, index);
      }, index * 400);
    });
  }

  stop() {
    this.stopTrigger = true;
  }

  initColumns() {
    this.columns = Array.of(...this.slotsEl.querySelectorAll('.slot__column'));
    this.columnsStats = [{}, {}, {}];

    this.columns.forEach((column, index) => {
      let startCellIndex = index * 3;

      for (let i = 0; i < 5; ++i) {
        const cell = this.cellMap.get((i + startCellIndex) % MAX_CELLS_NUMBER).cloneNode(true);
        column.appendChild(cell);
      }

      this.columnsStats[index].topCellIndex = startCellIndex;
    });

    this.placeCellsIntoColumns();
    resizeObserver.subscribe(this.placeCellsIntoColumns);
  }

  placeCellsIntoColumns() {
    this.initCellSizes();

    this.columns.forEach((column) => {
      const cells = column.querySelectorAll('.slot__cell');
      cells.forEach((cell, cellIndex) => {
        const offset = cellIndex * (this.cellHeight + this.cellGap);
        cell.setAttribute('style', `transform: translate3d(0, ${offset}px, 0);`);
      });
    });
  }

  move(column, index) {
    this.moveCells(column, index);

    if (this.columnsStats[index].currentSpeed <= this.columnsStats[index].startSpeed) {
      setTimeout(() => {
        const step = this.stopTrigger ? this.columnsStats[index].deceleration : this.columnsStats[index].acceleration;
        this.columnsStats[index].currentSpeed = this.columnsStats[index].currentSpeed - step;

        if (this.columnsStats[index].currentSpeed < this.columnsStats[index].maxSpeed) {
          this.columnsStats[index].currentSpeed = this.columnsStats[index].maxSpeed;
        }

        this.move(column, index);
      }, this.columnsStats[index].currentSpeed);
    } else {
      this.columnsStats[index].isActive = false;

      if (this.winAnyway) {
        setTimeout(() => {
          while (this.columnsStats[index].topCellIndex !== this.winCell) {
            this.moveCells(column, index);
          }
        }, this.columnsStats[index].currentSpeed);
      }

      if (this.columnsStats.every((item) => !item.isActive)) {
        setTimeout(() => {
          this.stopTrigger = false;
          this.isGameStarted = false;

          let haveWinner = true;
          for (let i = 1; i < this.columnsStats.length; ++i) {
            if (this.columnsStats[i - 1].topCellIndex !== this.columnsStats[i].topCellIndex) {
              haveWinner = false;
              break;
            }
          }

          this.parent.dispatchEvent(new CustomEvent('onslotsfinished', {
            detail: {
              isWinner: haveWinner,
            },
          }));
        }, this.columnsStats[index].currentSpeed);
      }
    }
  }

  moveCells(column, index) {
    const cells = column.querySelectorAll('.slot__cell');
    cells.forEach((cell, cellIndex) => {
      const offset = cellIndex * (this.cellHeight + this.cellGap);
      cell.setAttribute('style', `transform: translate3d(0, ${offset}px, 0); transition: transform ${this.columnsStats[index].currentSpeed / 500}s ease;`);
    });

    const lastCell = column.lastElementChild;
    column.removeChild(lastCell);
    lastCell.remove();
    this.columnsStats[index].topCellIndex = --this.columnsStats[index].topCellIndex < 0 ? MAX_CELLS_NUMBER + this.columnsStats[index].topCellIndex : this.columnsStats[index].topCellIndex;
    const newCell = this.cellMap.get(this.columnsStats[index].topCellIndex).cloneNode(true);
    column.prepend(newCell);

    newCell.setAttribute('style', `transform: translate3d(0, ${-1 * (this.cellHeight + this.cellGap)}px, 0);`);
  }

  initCellSizes() {
    const cell = this.slotsEl.querySelector('.slot__cell');
    this.cellHeight = cell.getBoundingClientRect().height;
    this.cellGap = 10;
  }

  getLastGameResult() {
    let result = true;
    for (let i = 1; i < this.columnsStats.length; ++i) {
      if (this.columnsStats[i - 1].topCellIndex !== this.columnsStats[i].topCellIndex) {
        result = false;
        break;
      }
    }

    return result;
  }
}
