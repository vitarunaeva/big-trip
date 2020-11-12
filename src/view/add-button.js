import AbstractView from './abstract.js';
import {TabAdditionalItem} from '../const.js';

export const createAddButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow"
             type="button"
             value="${TabAdditionalItem.ADD_NEW_EVENT}">
        New event
     </button>`
  );
};

export default class AddButton extends AbstractView {
  constructor() {
    super();
    this._buttonClickHandler = this._buttonClickHandler.bind(this);
  }

  _getTemplate() {
    return createAddButtonTemplate();
  }

  setDisabledButton(state) {
    this.getElement().disabled = state;
  }

  _buttonClickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonClick(evt.target.value);
  }

  setButtonClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.getElement()
      .addEventListener(`click`, this._buttonClickHandler);
  }
}
