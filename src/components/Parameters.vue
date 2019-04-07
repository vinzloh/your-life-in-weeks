<template>
  <div>
    Born
    <input type="date" name="startDate" v-model="startDate">
    , looking forward to the next
    <input
      type="number"
      min="1"
      max="120"
      name="projectionDate"
      v-model="tenureInYears"
    >
    years!
  </div>
</template>
<script>
export default {
  props: {
    value: { type: Object }
  },
  computed: {
    startDate: {
      get() {
        return this.value.startDate;
      },
      set(v) {
        console.log("set startDate:", v);
        this.$emit("input", {
          startDate: v,
          tenureInYears: this.tenureInYears
        });
      }
    },
    tenureInYears: {
      get() {
        return this.value.tenureInYears;
      },
      set(v) {
        console.log("set tenureInYears:", v);
        this.$emit("input", {
          startDate: this.startDate,
          tenureInYears: +v
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
input[type="number"] {
  max-width: 50px;
}
</style>
