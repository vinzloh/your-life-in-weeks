<template>
  <div>
    <ul v-for="y in tenureInYears" :key="yearID(y)">
      <li class="row-header" data-year-tip :data-tippy-content="yearSummary(y)">{{year(y)}}</li>
      <li
        v-for="w in weeksInYear({ yearIncrement: y, firstYearDate })"
        :class="{ 'has-event': hasEvent(y,w) }"
        :key="w"
        :data-event-tip="hasEvent(y,w) ? '' : undefined "
        :data-tippy-content="weekContent(y,w)"
      >{{w}}</li>
    </ul>
  </div>
</template>

<script>
import datefns from "date-fns";
import tippy from "tippy.js";
import {
  toDate,
  formatDate,
  isSameWeek,
  weeksInYear,
  currentDateByYear
} from "../helpers";

export default {
  props: {
    dataByYear: { type: Object },
    dataByYearWeek: { type: Object },
    tenureInYears: { type: Number },
    startDate: { type: String }
  },
  data() {
    return {
      yearTippies: [],
      eventTippies: [],
      weeksInYear
    };
  },
  computed: {
    firstYearDate() {
      return toDate(this.startDate);
    }
  },
  watch: {
    dataByYear(v) {
      this.$nextTick(() => {
        if (this.yearTippies) {
          this.yearTippies.forEach(d => d.destroy());
        }
        this.yearTippies = tippy("[data-year-tip]");
      });
    },
    dataByYearWeek(v) {
      this.$nextTick(() => {
        if (this.eventTippies) {
          this.eventTippies.forEach(d => d.destroy());
        }
        this.eventTippies = tippy("[data-event-tip]");
      });
    }
  },
  methods: {
    yearSummary(yearIncrement) {
      const { firstYearDate } = this;
      const { differenceInYears, getYear } = datefns;
      const currentDate = currentDateByYear({ yearIncrement, firstYearDate });
      const age = differenceInYears(currentDate, firstYearDate);
      const year = getYear(currentDate);
      const yearData = this.dataByYear[year] || [];
      const summarize = event => `${event.title}`;
      const summary =
        yearData.map(summarize).join(" | ") || " nothing exciting happened :(";
      return `At ${age} (${
        yearData.length ? `${yearData.length} events` : ""
      } in ${year}), ${summary}`;
    },
    yearID(yearIncrement) {
      const { firstYearDate } = this;
      return datefns.getYear(
        currentDateByYear({ yearIncrement, firstYearDate })
      );
    },
    year(year) {
      const { firstYearDate } = this;
      const { getYear } = datefns;
      const age = year - 1;
      return `${getYear(firstYearDate) + age} ${age}`;
    },
    dateByWeek(yearIncrement, week) {
      const { addWeeks, addYears } = datefns;
      const weeksToAdd = week - 1;
      const yearsToAdd = yearIncrement - 1;
      return addWeeks(addYears(this.firstYearDate, yearsToAdd), weeksToAdd);
    },
    getDataByDate(date) {
      const year = datefns.getYear(date);
      const week = datefns.getISOWeek(date);
      const yearHash = this.dataByYearWeek[year] || {};
      const weekArray = yearHash[week] || [];
      return weekArray;
    },
    hasEvent(yearIncrement, week) {
      const { getDataByDate } = this;
      const dateByWeek = this.dateByWeek(yearIncrement, week);
      return getDataByDate(dateByWeek).filter(({ timestamp, title }) =>
        isSameWeek(dateByWeek, toDate(timestamp))
      ).length;
    },
    atAge(compareDate) {
      const startDate = this.firstYearDate;
      let age = datefns.differenceInYears(compareDate, startDate);
      if (age < 1) {
        age = datefns.differenceInWeeks(compareDate, startDate);
        age = `${age} weeks`;
        // console.log(`age:`, age);
      }
      return age;
    },
    tipText({ timestamp, title = "", description = "" } = {}) {
      const { atAge } = this;
      const currentDate = toDate(timestamp);
      return `At ${atAge(currentDate)}, ${title}\n ${description} (${formatDate(
        currentDate
      )})`;
    },
    weekContent(yearIncrement, week) {
      const { tipText, weekEvent, dateByWeek } = this;
      const event = weekEvent(yearIncrement, week);
      return event
        ? tipText(event)
        : formatDate(dateByWeek(yearIncrement, week));
    },
    weekEvent(yearIncrement, week) {
      const { getDataByDate } = this;
      const dateByWeek = this.dateByWeek(yearIncrement, week);
      return getDataByDate(dateByWeek).filter(
        ({ timestamp, title, description }) =>
          isSameWeek(dateByWeek, toDate(timestamp))
      )[0];
    }
  }
};
</script>

<style lang="scss" scoped>
ul {
  font-size: 1.25vw;
  list-style-type: none;
  padding: 0;
  text-align: left;
  margin: 0;
  /* margin-left: 4vw; */
  &:hover {
    outline: 1px solid rgba($color: royalblue, $alpha: 0.7);
  }
}
li {
  white-space: nowrap;
  font-size: 0.87em;
  min-width: 1.2em;
  text-align: center;
  display: inline-block;
  margin: 0;
  border: 1px solid rgba($color: #000000, $alpha: 0.25);
  position: relative;
  cursor: pointer;
  &.row-header {
    border: 1px solid rgba($color: royalblue, $alpha: 0.7);
    border-radius: 3px;
    padding: 0 0.125rem;
    width: 4vw;
    margin-right: 0.3125rem;
  }
  &.has-event {
    background-color: rgba($color: royalblue, $alpha: 0.7);
  }
}
</style>
