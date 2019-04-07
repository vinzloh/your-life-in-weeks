<template>
  <file-upload
    class="btn"
    post-action="/upload/post"
    extensions="json"
    accept="application/json"
    :multiple="true"
    :size="1024 * 1024 * 10"
    v-model="files"
    @input-filter="inputFilter"
    @input-file="inputFile"
    ref="upload"
  >+ Upload json data</file-upload>
</template>
<style lang="scss" scoped>
.btn {
  font-size: 0.7rem;
  background-color: rgba($color: royalblue, $alpha: 0.87);
  padding: 3px 5px;
  border-radius: 4px;
  color: white;
  & /deep/ label {
    cursor: pointer;
  }
}
</style>

<script>
import FileUpload from "vue-upload-component";

export default {
  props: {
    onLoad: { type: Function, default: () => {} }
  },
  components: {
    FileUpload
  },
  data() {
    return {
      files: []
    };
  },
  methods: {
    inputFilter(newFile, oldFile, prevent) {
      // Before adding a file
      if (newFile && !oldFile) {
        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }
        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
      }
    },
    inputFile(newFile, oldFile) {
      const c = this;
      if (newFile && !oldFile) {
        const fr = new FileReader();
        fr.onload = function(e) {
          c.onLoad(JSON.parse(e.target.result));
        };
        fr.readAsText(newFile.file);
      }
    }
  }
};
</script>
