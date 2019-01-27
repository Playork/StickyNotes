<template>
  <div id="body">
    <top v-bind:close="close"/>
    <bottom v-bind:note="note"/>
  </div>
</template>
<script>
import { remote, ipcRenderer } from "electron";
import top from "../components/top.vue";
import bottom from "../components/bottom.vue";
export default {
  components: {
    top,
    bottom
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
@font-face {
  font-family: "Lobster";
  src: url(../assets/Lobster.woff2) format("woff2");
}
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
  font-family: "Lobster";
  background: #202020;
}
button {
  outline: none;
}
</style>
