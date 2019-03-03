<template>
  <div class="home" v-on:click="savenote">
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
  mounted() {},
  methods: {
    savenote: function() {
      document.getElementById("notes").innerHTML = "";
      stores.each((value, key) => {
        if (key != "id" && key != "loglevel:webpack-dev-server") {
          document
            .getElementById("notes")
            .insertAdjacentHTML(
              "afterbegin",
              `<div id="notetext"><span id="startnote">&#xE710;</span><span id="deletenote"></span>${
                value.first
              }</div>`
            );
          document.getElementById("startnote").onclick = () => {
            stores.set("id", { ids: key });
            ipcRenderer.send("create-new-instance");
          };
          document.getElementById("deletenote").onclick = () => {
            const options = {
              type: "warning",
              title: "Delete?",
              message: "Do You Want To Delete The Note?",
              buttons: ["Yes", "No"]
            };
            remote.dialog.showMessageBox(options, index => {
              if (index === 0) {
                stores.remove(key);
              }
            });
          };
        }
      });
    },
    close: function() {
      stores.each((value, key) => {
        if (key != "id" && key != "loglevel:webpack-dev-server") {
          if (value.first == "<p><br></p>") {
            stores.remove(key);
          }
        }
      });
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