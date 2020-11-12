import moment from 'moment';
import AbstractView from './abstract.js';
import {eventTypePostfix} from '../utils/trip.js';
import {humanizeDuration, toFirstUpperLetter} from '../utils/common.js';
import {MAX_OFFERS} from '../const';

const createOfferItemTemplate = ({title, price}) => {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      +
      €&nbsp;<span class="event__offer-price">${price}</span>
    </li>`
  );
};

const createOffersTemplate = (offers) => {
  if (offers.length === 0) {
    return ``;
  }

  const offerItems = offers
    .slice(0, MAX_OFFERS)
    .map((offer) => createOfferItemTemplate(offer))
    .join(``);

  return `<ul class="event__selected-offers">
    ${offerItems}
  </ul>`;
};

const createEventTemplate = (event) => {
  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${event.type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${toFirstUpperLetter(event.type)} ${eventTypePostfix(event.type)} ${event.destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime=${moment(event.startDate).format(`YYYY-MM-DD[T]HH:mm`)}>
             ${moment(event.startDate).format(`HH:mm`)}
            </time>
            —
            <time class="event__end-time" datetime=${moment(event.endDate).format(`YYYY-MM-DD[T]HH:mm`)}>
             ${moment(event.endDate).format(`HH:mm`)}
            </time>
          </p>
          <p class="event__duration">${humanizeDuration(event.endDate, event.startDate)}</p>
        </div>
        <p class="event__price">
          €&nbsp;<span class="event__price-value">${event.price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${createOffersTemplate(event.offers)}
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractView {
  constructor(tripEvent) {
    super();

    this._tripEvent = tripEvent;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  _getTemplate() {
    return createEventTemplate(this._tripEvent);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }
}
