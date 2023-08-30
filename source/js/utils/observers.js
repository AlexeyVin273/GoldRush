export class EventObserver {
  constructor() {
    this.observers = [];
    this.fire = this.fire.bind(this);
  }

  subscribe(fn) {
    this.observers.push(fn);
  }

  unsubscribe(fn) {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  fire(data) {
    this.observers.forEach((subscriber) => subscriber(data));
  }
}

const resizeObserver = new EventObserver();
const resizeObserverProto = new ResizeObserver(() => setTimeout(() => resizeObserver.fire('resize'), 10));
resizeObserverProto.observe(document.documentElement);

export {resizeObserver};

const clickObserver = new EventObserver();
window.addEventListener('click', clickObserver.fire);
export {clickObserver};
