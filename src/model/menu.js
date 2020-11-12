import Observer from "../utils/observer.js";
import {TabNavItem} from '../const.js';

export default class Menu extends Observer {
  constructor() {
    super();

    this._active = TabNavItem.TABLE;
  }

  set(updateType, menu) {
    this._active = menu;
    this._notify(updateType, menu);
  }

  get() {
    return this._active;
  }
}
