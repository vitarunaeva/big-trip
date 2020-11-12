import EventPresenter from './presenter/event.js';
import Api from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import TripInfoPresenter from './presenter/trip-info.js';
import MenuPresenter from './presenter/menu.js';
import StatisticsPresenter from './presenter/statistics.js';
import {UpdateType} from './const.js';
import Menu from "./model/menu";
import Destinations from "./model/destinations";
import Offers from "./model/offers";
import Points from "./model/points";
import NewPoint from "./model/new-point";
import Filter from "./model/filter";


const AUTHORIZATION = `Basic c100b03212rt4hs`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, localStorage);
const apiWithProvider = new Provider(api, store);

const menuModel = new Menu();
const destinationsModel = new Destinations();
const offersModel = new Offers();
const pointsModel = new Points();
const newPointModel = new NewPoint();
const filterModel = new Filter();

const bodyElement = document.querySelector(`.page-body`);
const headerElement = bodyElement.querySelector(`.page-header`);

const tripMainElement = headerElement.querySelector(`.trip-main`);

const mainElement = document.querySelector(`.page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);
const statisticsElement = mainElement.querySelector(`.page-body__container`);

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
const menuPresenter = new MenuPresenter(tripMainElement, newPointModel, menuModel, filterModel, pointsModel);
const eventPresenter = new EventPresenter(tripEventsElement, pointsModel, filterModel, newPointModel, menuModel, offersModel, destinationsModel, apiWithProvider);
const statisticsPresenter = new StatisticsPresenter(statisticsElement, pointsModel, menuModel);

const fetchedDataPromises = [
  apiWithProvider.getDestinations(),
  apiWithProvider.getOffers(),
  apiWithProvider.getPoints()
];

Promise.all(fetchedDataPromises)
  .then(([destinations, offers, points]) => {
    offersModel.set(offers);
    eventPresenter.init();
    tripInfoPresenter.init();
    statisticsPresenter.init();
    menuPresenter.init();
    destinationsModel.set(destinations);
    pointsModel.set(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.set(UpdateType.CRASH, []);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
