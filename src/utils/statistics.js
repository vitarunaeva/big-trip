import {StatisticsType, MoveType} from '../const';
import moment from 'moment';

const extractValue = (event, statisticsType) => {
  let result = 0;

  switch (statisticsType) {
    case StatisticsType.MONEY:
      result += event.price;
      break;
    case StatisticsType.TRANSPORT:
      if (Object.values(MoveType).includes(event.type)) {
        result++;
      } else {
        result = null;
      }
      break;
    case StatisticsType.TIME_SPENT:
      const startMoment = moment(event.startDate);
      const finishMoment = moment(event.endDate);
      result += moment.duration(finishMoment.diff(startMoment));
  }

  return result;
};

const roundResult = (rawValue, statisticsType) => {
  switch (statisticsType) {
    case StatisticsType.TIME_SPENT:
      return moment.duration(rawValue).hours() + 1;
    default:
      return Math.round(rawValue);
  }
};

export const calculateStat = (events, statisticsType) => {
  const groupedEvents = Object.create(null);

  events.forEach((event) => {
    if (!groupedEvents[event.type]) {

      const extractedValue = extractValue(event, statisticsType);
      if (extractedValue) {
        groupedEvents[event.type] = extractedValue;
      }

    } else {
      groupedEvents[event.type] += extractValue(event, statisticsType);
    }
  });

  Object.keys(groupedEvents).forEach((statKey) => {
    groupedEvents[statKey] = roundResult(groupedEvents[statKey], statisticsType);
  });

  return groupedEvents;
};
