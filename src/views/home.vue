<template>
  <div id="home">
    <titlebar1 v-bind:close="close" v-bind:note="note"/>
    <homebody/>
  </div>
</template>
<script>
import { remote, ipcRenderer } from "electron";
import swal from "./../assets/script/sweetalert.js";
import homebody from "../components/home/homebody.vue";
import titlebar1 from "../components/home/titlebar1.vue";
import store from "store";
export default {
  components: {
    titlebar1,
    homebody
  },
  mounted() {
    window.setInterval(() => {
      document.getElementById("notes").innerHTML = "";
      store.each((value, key) => {
        if (key != "id" && key != "loglevel:webpack-dev-server") {
          document
            .getElementById("notes")
            .insertAdjacentHTML(
              "afterbegin",
              `<div id="notetext"><span id="startnote" title="Start Note">&#xE710;</span><span id="deletenote" title="Delete Note">&#xE74D;</span>${
                value.first
              }</div>`
            );

          if (store.get(key).closed == "yes") {
            document.getElementById("startnote").style.display = "inline";
          }
          if (store.get(key).closed == "no") {
            document.getElementById("startnote").style.display = "none";
          }
          document.getElementById("startnote").onclick = () => {
            store.set("id", { ids: key });
            ipcRenderer.send("create-new-instance");
          };
          document.getElementById("deletenote").onclick = () => {
            swal({
              title: "Are you sure?",
              text: "Want To Delete Your Note!",
              icon: "warning",
              buttons: true,
              dangerMode: true
            }).then(willDelete => {
              if (willDelete) {
                if (store.get(key).closed == "no") {
                  store.set(key, { deleted: "yes" });
                }
                if (store.get(key).closed == "yes") {
                  store.remove(key);
                }
              }
            });
          };
          document.getElementById("notetext").style.backgroundColor =
            value.back;
          document.getElementById("notetext").style.border =
            "5px solid " + value.title;
        }
      });
    }, 2500);
    /*store.each((value, key) => {
      if (key != "id" && key != "loglevel:webpack-dev-server") {
        store.set("id", { ids: key });
        ipcRenderer.send("create-new-instance");
      }
    });*/
  },
  methods: {
    close: function() {
      store.each((value, key) => {
        if (key != "id" && key != "loglevel:webpack-dev-server") {
          if (value.first == "<p><br></p>") {
            store.remove(key);
          }
        }
      });
      remote.getCurrentWindow().close();
    },
    note: function() {
      let func = obj => {
        obj++;
        store.set("id", { ids: obj.toString() });
      };
      try {
        let id = Number(store.get("id").ids);
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