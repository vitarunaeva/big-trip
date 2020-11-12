import moment from 'moment';
import AbstractView from './abstract.js';
import {getTotalEventPrice} from '../utils/trip.js';
import {getSorterRule} from '../utils/trip.js';
import {SortType} from '../const.js';

const createDatesTemplate = (sortedEvents) => {
  const tripStartDate = sortedEvents[0].startDate;
  const tripFinishDate = sortedEvents[sortedEvents.length - 1].endDate;
  const isSameDay = moment(tripStartDate).isSame(tripFinishDate, `day`);
  const isSameMonth = moment(tripStartDate).isSame(tripFinishDate, `month`);
  const firstHumanizeDate = moment(tripStartDate).format(`MMM DD`);

  let tripInfoDates = ``;

  if (isSameDay) {
    tripInfoDates = tripInfoDates = firstHumanizeDate;
  } else if (isSameMonth) {
    tripInfoDates = `${firstHumanizeDate}&nbsp;—&nbsp;${moment(tripFinishDate).format(`DD`)}`;
  } else {
    tripInfoDates = `${firstHumanizeDate}&nbsp;—&nbsp;${moment(tripFinishDate).format(`MMM DD`)}`;
  }

  return tripInfoDates;
};

const createCitiesTemplate = (sortedEvents) => {
  const sortedCities = new Set(sortedEvents.map((event) => event.destination.name));
  const cities = [...sortedCities];

  const tripInfoPoints = [];
  tripInfoPoints.push([...cities][0]);

  switch (cities.length) {
    case 1:
      break;
    case 2:
      tripInfoPoints.push(cities[1]);
      break;
    default:
      tripInfoPoints.push(`...`);
      tripInfoPoints.push(cities[cities.length - 1]);
      break;
  }

  return tripInfoPoints.join(`&nbsp;—&nbsp;`);
};

const createTripInfoTemplate = (tripEvents) => {
  if (!tripEvents.length) {
    return `<div class="trip-info__main"></div>`;
  }

  const sortedEvents = tripEvents.sort(getSorterRule(SortType.EVENT));

  const cost = tripEvents.reduce((accumulatedSum, event) => accumulatedSum + getTotalEventPrice(event), 0);

  return (
    `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
            <h1 class="trip-info__title">${createCitiesTemplate(sortedEvents)}</h1>

            <p class="trip-info__dates">${createDatesTemplate(sortedEvents)}</p>
        </div>

        <p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
        </p>
     </section>`
  );
};

export default class TripInfo extends AbstractView {
  constructor(events) {
    super();
    this._tripEvents = events;
  }

  _getTemplate() {
    return createTripInfoTemplate(this._tripEvents);
  }
}
