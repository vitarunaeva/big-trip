import moment from 'moment';
import AbstractView from './abstract.js';

const createDayInfoTemplate = (dayId, groupedDate) => {
  if (groupedDate === null) {
    return ``;
  }

  return (
    `<span class="day__counter">${dayId}</span>
    <time class="day__date" datetime="${moment(groupedDate).format(`YYYY-MM-DD`)}">${moment(groupedDate).format(`MMM DD`)}</time>`
  );
};

const createTripDaysTemplate = (dayId, groupedDate) => {
  return (
    `<ul class="trip-days">
      <li class="trip-days__item  day">
        <div class="day__info">
          ${createDayInfoTemplate(dayId, groupedDate)}
        </div>
        <ul class="trip-events__list">
        </ul>
      </li>
    </ul>`
  );
};

export default class TripDays extends AbstractView {
  constructor(dayId = null, groupedDate = null) {
    super();

    this._dayId = dayId;
    this._groupedDate = groupedDate;
  }

  _getTemplate() {
    return createTripDaysTemplate(this._dayId, this._groupedDate);
  }

  getPointContainer() {
    return this.getElement().querySelector(`.trip-events__list`);
  }
}
