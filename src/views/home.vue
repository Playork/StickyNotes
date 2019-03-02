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
import stores from "store";
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
      let func = obj => {
        obj++;
        stores.set("id", { ids: obj.toString() });
      };
      try {
        let id = Number(stores.get("id").ids);
        func(id);
      } catch {
        let id = 0;
        func(id);
      }
      ipcRenderer.send("create-new-instance");
    }
  }
};
</script>