<!--
MIT License

Copyright (c) 2019 Playork

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->

<!-- Home Page -->
<!-- Html -->
<template>
  <div id="home" v-on:click="savenote">
    <titlebar1 v-bind:close="close" v-bind:note="note"/>
    <homebody/>
  </div>
</template>

<!-- Javascript -->
<script>
// Import Required Packages
import { remote, ipcRenderer } from "electron";
import homebody from "../components/home/homebody.vue";
import titlebar1 from "../components/home/titlebar1.vue";
import stores from "store";
export default {
  // Components
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
              `<div id="notetext"><span id="startnote">&#xE710;</span><span id="deletenote">&#xE74D;</span>${
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