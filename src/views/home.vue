<template>
  <div id="body">
    <titlebar1 v-bind:close="close"/>
    <homebody v-bind:note="note"/>
  </div>
</template>
<script>
import { remote, ipcRenderer } from "electron";
import homebody from "../components/homebody.vue";
import titlebar1 from "../components/titlebar1.vue";
export default {
  components: {
    titlebar1,
    homebody
  },
  methods: {
    close: function() {
      remote.getCurrentWindow().close();
    },
    note: function() {
      ipcRenderer.send("create-new-instance");
    }
  }
};
</script>
<style>
#body {
  user-select: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
button {
  outline: none;
}
</style>
