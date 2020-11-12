import Observer from "../utils/observer.js";

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  set(offers) {
    this._offers = offers.slice();
  }

  get() {
    return this._offers;
  }

  static adaptToClient(offer) {
    return offer;
  }

  static adaptToServer(offer) {
    return offer;
  }
}
