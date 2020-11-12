import flatpickr from 'flatpickr';
import moment from 'moment';
import {MoveType, ActivityType, POINT_ID, NEW_EVENT, State} from '../const.js';
import {eventTypePostfix, defineDestination, isPendingState} from '../utils/trip.js';
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import {toFirstUpperLetter} from "../utils/common";
import SmartView from "./smart.js";

const createEventTypesTemplate = (selectedType) => {
  return Object.values(selectedType).map((type) => (
    `<div class="event__type-item">
        <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type">
        <label class="event__type-label  event__type-label--${type.toLowerCase()}"
               for="event-type-${type}"
               data-type="${type}">
         ${toFirstUpperLetter(type)}
        </label>
      </div>`)).join(``);
};

const createDestinationItemsTemplate = (destinations, currentDestination, pointId) => {
  const {name: currentCity} = currentDestination;

  const destinationOptions = destinations
    .map((city) => (
      `<option value="${city.name}" ${currentCity === city.name ? `selected` : ``}>
        ${city.name}
      </option>`));

  if (pointId === POINT_ID) {
    destinationOptions.unshift(`<option selected disabled></option>`);
  }

  return destinationOptions.join(``);
};

const createAvailableOffersTemplate = (offers, selectedOffers, isDisabled) => {
  if (!offers.length) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${offers.map((singleOffer) => createOfferItemTemplate(singleOffer, selectedOffers.some((selectedOffer) => selectedOffer.title === singleOffer.title), isDisabled))
      .join(``)}
    </div>`
  );
};

const createOfferItemTemplate = (offer, isChecked, isDisabled) => {
  const normalizedOfferId = offer.title.replace(/\s/g, `-`).toLowerCase();

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
             id="event-offer-${normalizedOfferId}"
             type="checkbox"
             name="event-offer-${normalizedOfferId}"
             value="${offer.title}"
              ${isDisabled ? `disabled` : ``}
             ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${normalizedOfferId}">
      <span class="event__offer-title">${offer.title}</span>
      +
      €&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const createConcreteDestinationTemplate = (destination) => {
  if (!destination || !destination.description) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--destination">${destination.name}</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.pictures
      .map((picture) => (`<img class="event__photo" src="${picture.src}" alt="${picture.description}">`))
      .join(``)
    }
      </div>
    </div>`
  );
};

const createSubmitButtonTemplate = (isDisabled, editState) => {
  return (
    `<button class="event__save-btn  btn  btn--blue" type="submit"
      ${isDisabled ? `disabled` : ``}
    >
      ${editState === State.SAVING ? `Saving...` : `Save`}
    </button>`
  );
};

const createResetButtonTemplate = (pointId, isDisabled, editState) => {
  let buttonLabel = `Delete`;

  if (pointId === POINT_ID) {
    buttonLabel = `Cancel`;
  }

  if (editState === State.DELETING) {
    buttonLabel = `Deleting...`;
  }
  return (
    `<button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>
      ${buttonLabel}
    </button>`
  );
};

const createFavoriteButtonTemplate = (pointId, isFavoriteEvent) => {
  if (pointId === POINT_ID) {
    return ``;
  }

  return `<input id="event-favorite-${pointId}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavoriteEvent ? `checked` : ``}>
  <label class="event__favorite-btn" for="event-favorite">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </label>`;
};

const createRollupButtonTemplate = (pointId) => {
  if (pointId === POINT_ID) {
    return ``;
  }

  return `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;
};

const createEditTripEventTemplate = (eventItem, destinations, offersList, editState) => {
  const isInterfaceDisabled = isPendingState(editState);
  const isSubmitDisabled = isNaN(eventItem.price) || eventItem.destination.name === `` || isInterfaceDisabled;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventItem.type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox"  ${isInterfaceDisabled ? `disabled` : ``}>
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${createEventTypesTemplate(MoveType)}
            </fieldset>
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${createEventTypesTemplate(ActivityType)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination">
            ${toFirstUpperLetter(eventItem.type)} ${eventTypePostfix(eventItem.type)}
          </label>
            <select class="event__input  event__input--destination" id="event-destination" name="event-destination" ${isInterfaceDisabled ? `disabled` : ``}>
            <datalist id="destination-list">
              ${createDestinationItemsTemplate(destinations, eventItem.destination, eventItem.id)}
            </datalist>
          </select>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="${moment(eventItem.startDate).format(`DD/MM/YY HH:mm`)}" ${isInterfaceDisabled ? `disabled` : ``}">
          —
          <label class="visually-hidden" for="event-end-time">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="${moment(eventItem.endDate).format(`DD/MM/YY HH:mm`)}" ${isInterfaceDisabled ? `disabled` : ``}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price" type="number" min="0" name="event-price" value="${eventItem.price}" autocomplete="off" ${isInterfaceDisabled ? `disabled` : ``}">
        </div>
        ${createSubmitButtonTemplate(isSubmitDisabled, editState)}
        ${createResetButtonTemplate(eventItem.id, isInterfaceDisabled, editState)}
        ${createFavoriteButtonTemplate(eventItem.id, eventItem.isFavorite)}
        ${createRollupButtonTemplate(eventItem.id)}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${createAvailableOffersTemplate(offersList, eventItem.offers, isInterfaceDisabled)}
        </section>
        <section class="event__section  event__section--destination">
          ${createConcreteDestinationTemplate(eventItem.destination)}
        </section>
      </section>
    </form>`
  );
};

export default class EventEditor extends SmartView {
  constructor(destinations = [], tripOffers = [], eventItem = NEW_EVENT) {
    super();

    this._offers = tripOffers.find((offer) => eventItem.type.toLowerCase() === offer.type);

    this._eventItem = eventItem;
    this._sourceItem = JSON.parse(JSON.stringify(eventItem));
    this._sourceItem.startDate = new Date(this._sourceItem.startDate);
    this._sourceItem.endDate = new Date(this._sourceItem.endDate);
    this._destinations = destinations;
    this._allOffers = [...tripOffers];
    this._offerList = this._offers ? this._offers.offers : [];
    this._datepickers = null;

    this._editState = State.DEFAULT;

    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._typeClickHandler = this._typeClickHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._cancelClickHandler = this._cancelClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._startChangeHandler = this._startChangeHandler.bind(this);
    this._endChangeHandler = this._endChangeHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset() {
    this._editState = State.DEFAULT;
    this.updateData(this._sourceItem);
  }

  _getTemplate() {
    return createEditTripEventTemplate(this._eventItem, this._destinations, this._offerList, this._editState);
  }

  setEditState(state) {
    this._editState = state;
    this.updateElement();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);

    if (this._callback.cancelClick) {
      this.setCancelClickHandler(this._callback.cancelClick);
    }
    if (this._callback.favoriteClick) {
      this.setFavoriteClickHandler(this._callback.favoriteClick);
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`click`, this._typeClickHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationInputHandler);
  }

  _destroyDatePickers() {
    if (this._datepickers) {
      this._datepickers.forEach((item) => item.destroy());
      this._datepickers = null;
    }
  }

  setDatePickers() {
    this._destroyDatePickers();

    const eventStartDate = flatpickr(
        this.getElement().querySelector(`.event__input--time[name="event-start-time"]`),
        {
          'enableTime': true,
          'time_24hr': true,
          'dateFormat': `d/m/y H:i`,
          'defaultDate': this._eventItem.startDate,
          'onChange': this._startChangeHandler
        }
    );

    const eventEndDate = flatpickr(
        this.getElement().querySelector(`.event__input--time[name="event-end-time"]`),
        {
          'enableTime': true,
          'time_24hr': true,
          'dateFormat': `d/m/y H:i`,
          'defaultDate': this._eventItem.endDate,
          'minDate': this._eventItem.startDate,
          'onChange': this._endChangeHandler
        }
    );

    this._datepickers = [eventStartDate, eventEndDate];
  }

  _startChangeHandler([selectedDate]) {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      this._eventItem.startDate = newDate;
      this._datepickers[1].set(`minDate`, newDate);
    }
  }


  _endChangeHandler([selectedDate]) {
    if (selectedDate) {
      this._eventItem.endDate = new Date(selectedDate);
    }
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    const price = parseInt(evt.target.value, 10);

    this.updateData({
      price
    }, true);
  }

  _typeClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.className.indexOf(`event__type-label`) === -1) {
      return;
    }

    const selectedEventType = evt.target.dataset.type;

    this._offerList = this._allOffers.find((offer) => selectedEventType.toLowerCase() === offer.type).offers;

    if (selectedEventType === this._eventItem.type) {
      this.getElement().querySelector(`.event__type-btn`).click();
      return;
    }

    this.updateData({
      type: selectedEventType,
      offers: []
    });

    this.updateElement();
    this.setDatePickers();
  }


  _defineSelectedOffers() {
    const checkedTitles = Array
      .from(this.getElement().querySelectorAll(`.event__offer-checkbox`))
      .filter((element) => element.checked)
      .map((element) => element.value);

    const offers = this._offerList.filter((offer) => checkedTitles.includes(offer.title));

    this.updateData({offers}, true);
    this.updateElement();
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    const selectedCity = evt.target.value;

    if (selectedCity === this._eventItem.destination.name) {
      return;
    }

    const updatedProperty = defineDestination(this._destinations, selectedCity);
    const isRenderActual = updatedProperty.description === this._eventItem.destination.description;

    this.updateData({
      destination: updatedProperty
    }, isRenderActual);

    this.updateElement();
  }


  _cancelClickHandler(evt) {
    evt.preventDefault();
    this.reset();
    this._callback.cancelClick();
    this._destroyDatePickers();
  }

  _favoriteClickHandler() {
    this.updateData({
      isFavorite: !this._eventItem.isFavorite
    });
    this._callback.favoriteClick(this._eventItem);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._defineSelectedOffers();
    this.setEditState(State.SAVING);
    this._destroyDatePickers();
    this._callback.formSubmit(this._eventItem);
  }

  updateData(updatedData, justDataUpdating) {
    super.updateData(updatedData, justDataUpdating);
    this._eventItem = Object.assign({}, this._eventItem, this._data);
    this._sourceItem.isFavorite = this._eventItem.isFavorite;

    if (!justDataUpdating) {
      this.updateElement();
    }
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
    this._destroyDatePickers();
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._cancelClickHandler);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._destroyDatePickers();
    this.setEditState(State.DELETING);
    this._callback.deleteClick();
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this._destroyDatePickers();
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }
}
