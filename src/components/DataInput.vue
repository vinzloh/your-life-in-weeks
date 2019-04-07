<template>
  <div>
    <p>Editable JSON Data:</p>
    <textarea name id cols="50" rows="10" v-model="prettyRaw"/>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array
    }
  },
  computed: {
    prettyRaw: {
      get() {
        return JSON.stringify(this.value, null, 2);
      },
      set(v) {
        const value = JSON.parse(v);
        this.$emit("input", value);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
textarea {
  font-size: 0.7rem;
}
</style>
