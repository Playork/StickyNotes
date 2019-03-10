<template>
  <div id="home">
    <titlebar1 v-bind:close="close" v-bind:note="note"/>
    <homebody/>
  </div>
</template>
<script>
import { remote, ipcRenderer } from "electron";
import swal from "sweetalert";
import homebody from "../components/home/homebody.vue";
import titlebar1 from "../components/home/titlebar1.vue";
import stores from "store";
export default {
  components: {
    titlebar1,
    homebody
  },
  mounted() {
    window.setInterval(() => {
      document.getElementById("notes").innerHTML = "";
      stores.each((value, key) => {
        if (key != "id" && key != "loglevel:webpack-dev-server") {
          document
            .getElementById("notes")
            .insertAdjacentHTML(
              "afterbegin",
              `<div id="notetext"><span id="startnote" title="Start Note">&#xE710;</span><span id="deletenote" title="Delete Note">&#xE74D;</span>${
                value.first
              }</div>`
            );
          document.getElementById("startnote").onclick = () => {
            stores.set("id", { ids: key });
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
                stores.remove(key);
              }
            });
          };
          document.getElementById("notetext").style.backgroundColor =
            value.back;
          document.getElementById("notetext").style.border =
            "5px solid " + value.title;
        }
      });
    }, 1000);
  },
  methods: {
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