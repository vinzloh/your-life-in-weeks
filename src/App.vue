<template>
  <div id="app">
    <h1 class="app-header">Your Life in Weeks</h1>
    <small class="wip">a work in progress (not mobile friendly)</small>
    <p>
      inspired by
      <a
        href="https://waitbutwhy.com/2014/05/life-weeks.html"
        target="_blank"
      >Wait But why</a>
    </p>
    <div class="divider"></div>
    <p>Edit and see changes instantly - pick less years, up/down arrows on datepicker years for a slideshow :)</p>
    <Parameters v-model="params"/>
    <DataInput v-model="data"/>
    <div class="upload-json">OR
      <UploadFile :onLoad="onLoadJSON"/>
    </div>
    <p>
      Hover over
      <span class="highlight">colors</span> for bubbles! :)
    </p>
    <LifeInWeeks v-bind="dataProps"/>
  </div>
</template>

<script>
import LifeInWeeks from "./components/LifeInWeeks";
import UploadFile from "./components/UploadFile";
import DataInput from "./components/DataInput";
import Parameters from "./components/Parameters";
import {
  toDate,
  normalizeDataByYear,
  normalizeDataByYearWeek
} from "./helpers";
import sample from "../sample.json";
import setup from "../setup.json";

export default {
  name: "App",
  components: {
    Parameters,
    DataInput,
    UploadFile,
    LifeInWeeks
  },
  data() {
    return {
      dataParams: setup,
      rawData: sample,
      dataByYear: {},
      dataByYearWeek: {}
    };
  },
  computed: {
    dataProps() {
      return {
        ...this.params,
        dataByYear: this.dataByYear,
        dataByYearWeek: this.dataByYearWeek
      };
    },
    params: {
      get() {
        return this.dataParams;
      },
      set(v) {
        console.log(`params set:`, v);
        this.dataParams = v;
        this.updateDataHashes(this.data);
      }
    },
    data: {
      get() {
        return this.rawData;
      },
      set(v) {
        console.log(`data set:`, v);
        this.rawData = v;
        this.updateDataHashes(v);
      }
    }
  },
  methods: {
    updateDataHashes(json) {
      this.dataByYear = normalizeDataByYear(json);
      this.dataByYearWeek = normalizeDataByYearWeek(json);
      console.log("updateDataHashes dataByYearWeek:", this.dataByYearWeek);
      console.log("updateDataHashes dataByYear:", this.dataByYear);
    },
    onLoadJSON(json) {
      console.log(`onLoadJSON:`, json);
      this.data = json;
    }
  },
  mounted() {
    this.onLoadJSON(this.rawData);
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: 0.8rem;
}
:root {
  font-size: 16px;
}
.app-header {
  margin-bottom: 0rem;
}
.highlight {
  font-weight: bold;
  color: rgba($color: royalblue, $alpha: 1);
}
p {
  margin: 0.5rem 0;
}
.divider {
  margin: 5vh;
}
.upload-json {
  > * {
    display: inline-block;
    vertical-align: middle;
  }
}
.wip {
  /* font-weight: bold; */
  color: rgba($color: royalblue, $alpha: 1);
}
</style>
