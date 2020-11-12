import Observer from '../utils/observer.js';
import Offers from './offers.js';
import Destinations from './destinations.js';

export default class Points extends Observer {
  constructor() {
    super();
    this._items = [];
  }

  set(updateType, items) {
    this._items = items.slice();

    this._notify(updateType);
  }

  get() {
    return this._items;
  }

  updateItem(updateType, selectedItem) {
    const index = this._items.findIndex((currentItem) => currentItem.id === selectedItem.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting item by id`);
    }

    this._items = [
      ...this._items.slice(0, index),
      selectedItem,
      ...this._items.slice(index + 1)
    ];

    this._notify(updateType, selectedItem);
  }

  add(updateType, selectedItem) {
    this._items = [selectedItem, ...this._items];
    this._notify(updateType, selectedItem);
  }

  delete(updateType, selectedItem) {
    this._items = this._items.filter((currentItem) => currentItem.id !== selectedItem.id);
    this._notify(updateType);
  }

  static adaptToClient(point) {
    return Object.assign(
        {},
        {
          id: point.id,
          type: point.type,
          price: point[`base_price`],
          startDate: point[`date_from`] !== null ? new Date(point[`date_from`]) : point[`date_from`],
          endDate: point[`date_to`] !== null ? new Date(point[`date_to`]) : point[`date_to`],
          offers: point.offers.map((singleOffer) => Offers.adaptToClient(singleOffer)),
          destination: Destinations.adaptToClient(point.destination),
          isFavorite: point[`is_favorite`]
        }
    );
  }


  static adaptToServer(point) {
    return Object.assign(
        {},
        {
          "id": point.id,
          "type": point.type,
          "base_price": point.price,
          "date_from": point.startDate instanceof Date ? point.startDate.toISOString() : null,
          "date_to": point.endDate instanceof Date ? point.endDate.toISOString() : null,
          "offers": point.offers.map((singleOffer) => Offers.adaptToServer(singleOffer)),
          "destination": Destinations.adaptToServer(point.destination),
          "is_favorite": point.isFavorite
        }
    );
  }
}

