import {nanoid} from "nanoid";
import {getRandomInteger} from "../utils/random-integer.js";
import {StorageType} from "../const.js";
import PointsModel from "../model/points.js";
import DestinationsModel from '../model/destinations.js';
import OffersModel from '../model/offers.js';

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (Provider._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(PointsModel.adaptToServer));
          this._store.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems());
    if (!Provider._isOnline()) {
      storePoints.forEach((point) => {
        point.destination.pictures = point.destination.pictures.map((picture) => {
          return {src: `/img/photos/${getRandomInteger(1, 5)}.jpg`, description: picture.description};
        });
      });
    }
    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  getDestinations() {
    if (Provider._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = destinations.map(DestinationsModel.adaptToServer);
          this._store.setIndividualItem(StorageType.DESTINATIONS_STORAGE, items);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getIndividualItem(StorageType.DESTINATIONS_STORAGE));

    if (!Provider._isOnline()) {
      storeDestinations.forEach((it) => {
        it.pictures = it.pictures.map((picture) => {
          return {src: `/img/photos/${getRandomInteger(1, 5)}.jpg`, description: picture.description};
        });
      });
    }
    return Promise.resolve(storeDestinations.map(DestinationsModel.adaptToClient));
  }

  getOffers() {
    if (Provider._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = offers.map(OffersModel.adaptToServer);
          this._store.setIndividualItem(StorageType.OFFERS_STORAGE, items);
          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getIndividualItem(StorageType.OFFERS_STORAGE));

    return Promise.resolve(storeOffers.map(OffersModel.adaptToClient));
  }

  updatePoint(point) {
    if (Provider._isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._store.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (Provider._isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    const localNewPointId = nanoid();
    const localNewPoint = Object.assign({}, point, {id: localNewPointId});

    this._store.set(localNewPoint.id, PointsModel.adaptToServer(localNewPoint));

    return Promise.resolve(localNewPoint);
  }

  deletePoint(point) {
    if (Provider._isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    this._store.removeItem(point.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider._isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = response.created;
          const updatedPoints = getSyncedPoints(response.updated);


          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static _isOnline() {
    return window.navigator.onLine;
  }
}
