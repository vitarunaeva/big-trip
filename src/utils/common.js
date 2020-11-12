import moment from 'moment';

const addLeadZero = (digit) => {
  return digit < 10 ? `0` + digit : digit;
};

export const toFirstUpperLetter = (word) => {
  return word[0].toUpperCase() + word.slice(1, word.length);
};

export const humanizeDuration = (finishDate, startDate) => {
  const startMoment = moment(finishDate)
    .subtract(finishDate.getSeconds(), `seconds`)
    .subtract(finishDate.getMilliseconds(), `milliseconds`);
  const finishMoment = moment(startDate)
    .subtract(startDate.getSeconds(), `seconds`)
    .subtract(startDate.getMilliseconds(), `milliseconds`);

  const duration = moment.duration(startMoment.diff(finishMoment));
  const readableDurations = [];

  if (duration.days() > 0) {
    readableDurations.push(`${addLeadZero(duration.days())}D`);
  }

  if (duration.hours() > 0) {
    readableDurations.push(`${addLeadZero(duration.hours())}H`);
  }

  if (duration.minutes() > 0) {
    readableDurations.push(`${addLeadZero(duration.minutes())}M`);
  }

  return readableDurations.join(` `);
};

