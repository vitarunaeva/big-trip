import Observer from "../utils/observer.js";

export default class NewPoint extends Observer {
  constructor() {
    super();
  }

  set(updateType) {
    this._notify(updateType);
  }
}
