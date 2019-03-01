<template>
  <div class="home">
    <titlebar1 v-bind:close="close"/>
    <homebody v-bind:note="note"/>
  </div>
</template>
<script>
import { remote, ipcRenderer } from "electron";
import homebody from "../components/home/homebody.vue";
import titlebar1 from "../components/home/titlebar1.vue";
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