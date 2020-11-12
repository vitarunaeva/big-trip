import SmartView from './smart.js';
import {TabNavItem} from '../const.js';

const createMenuTemplate = (currentTab) => {
  return Object
    .values(TabNavItem)
    .map((tab) => (
      `<a href="#"
        class="trip-tabs__btn  ${currentTab === tab ? `trip-tabs__btn--active` : ``}"
        data-tab="${tab.toLowerCase()}">
        ${tab}
      </a>`))
    .join(``);
};

const createTripTabsTemplate = (currentTab) => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${createMenuTemplate(currentTab)}
      </nav>
    </div>`
  );
};

export default class Menu extends SmartView {
  constructor(initTab) {
    super();
    this._item = initTab;

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  setActiveTab(tab) {
    this._item = tab;
    this.updateElement();
  }

  restoreHandlers() {
    this.setMenuClickHandler(this._callback.menuClick);
  }

  _getTemplate() {
    return createTripTabsTemplate(this._item);
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.tab);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
