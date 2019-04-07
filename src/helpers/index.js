import datefns from "date-fns";

const toDate = timestamp => new Date(timestamp);
const formatDate = d => datefns.format(d, "DD MMM YYYY");
const isSameWeek = (date1, date2) => datefns.isSameISOWeek(date1, date2);
const currentDateByYear = ({ yearIncrement, firstYearDate }) =>
  datefns.addYears(firstYearDate, yearIncrement - 1);

const weeksInYear = props => {
  const yearDate = currentDateByYear(props);
  return datefns.getISOWeeksInYear(yearDate);
};

const normalizeDataByYearWeek = (data = []) =>
  data.reduce((hash, event) => {
    const [year] = event.timestamp.split("-");
    const week = datefns.getISOWeek(toDate(event.timestamp));
    const yearHash = hash[year] || {};
    const weekArray = yearHash[week] || [];
    hash[year] = {
      ...yearHash,
      [week]: [...weekArray, event]
    };
    return hash;
  }, {});

const normalizeDataByYear = (data = []) =>
  data.reduce((hash, event) => {
    const [year] = event.timestamp.split("-");
    const yearHash = hash[year] || [];
    hash[year] = [...yearHash, event];
    return hash;
  }, {});

module.exports = {
  currentDateByYear,
  isSameWeek,
  weeksInYear,
  formatDate,
  toDate,
  normalizeDataByYear,
  normalizeDataByYearWeek
};
