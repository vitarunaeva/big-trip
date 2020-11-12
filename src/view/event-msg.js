import AbstractView from './abstract.js';

export const createMsgTemplate = (msg) => {
  return (
    `<p class="trip-events__msg">${msg}</p>`
  );
};

export default class EventMsg extends AbstractView {
  constructor(msg) {
    super();

    this._msg = msg;
  }

  _getTemplate() {
    return createMsgTemplate(this._msg);
  }
}
