import moment from 'moment';
import {ActivityType, PostfixType, SortType, FilterType} from '../const.js';

export const eventTypePostfix = (eventType) => {
  return Object.values(ActivityType).includes(eventType) ? PostfixType.ACTIVITY : PostfixType.MOVE;
};

export const getSorterRule = (sortType) => {
  switch (sortType) {
    case SortType.EVENT:
      return (a, b) => moment(a.startDate) - moment(b.startDate);
    case SortType.TIME:
      return (a, b) => {
        const durationA = moment(a.endDate).diff(moment(a.startDate));
        const durationB = moment(b.endDate).diff(moment(b.startDate));
        return durationB - durationA;
      };
    case SortType.PRICE:
      return (a, b) => getTotalEventPrice(b) - getTotalEventPrice(a);
    default:
      throw new Error(`Incorrect sort type`);
  }
};

export const getFilterRule = (filterType) => {
  switch (filterType) {
    case FilterType.FUTURE:
      return (event) => moment().isBefore(event.startDate);
    case FilterType.PAST:
      return (event) => moment().isAfter(event.endDate);
    default:
      return () => true;
  }
};

export const getTotalEventPrice = (event) => {
  return event.offers.reduce((offerSum, offer) => offer.price + offerSum, event.price);
};

export const splitEventsByDays = (events) => {
  const groupedEvents = {};

  events.forEach((event) => {
    const shortDay = moment(event.startDate).format(`YYYY-MM-DD`);

    if (!groupedEvents[shortDay]) {
      groupedEvents[shortDay] = [event];
    } else {
      groupedEvents[shortDay].push(event);
    }
  });

  return groupedEvents;
};

export const splitEvents = (events) => {
  const groupedEvents = [];

  events.forEach((event) => {
    if (groupedEvents) {
      groupedEvents.push(event);
    }
  });

  return groupedEvents;
};

export const convertToNullableDate = (shortDay) => {
  const parsedTime = Date.parse(shortDay);
  return isNaN(parsedTime) ? null : new Date(parsedTime);
};

export const groupEvents = (sortType, sortedTripEvents) => {
  switch (sortType) {
    case SortType.EVENT:
      return splitEventsByDays(sortedTripEvents);
    case SortType.TIME:
    case SortType.PRICE:
      return splitEvents(sortedTripEvents);
    default:
      return {emptyDayWrapper: sortedTripEvents};
  }
};

export const defineDestination = (destinations, selectedCity) => {
  const destination = destinations.find((dest) => dest.name === selectedCity);

  if (destination) {
    return destination;
  }

  return {name: selectedCity};
};

export const isPendingState = (editState) => (editState < 0);
