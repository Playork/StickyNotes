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
import store from "store";
import { setTimeout } from "timers";
import os from "os";
export default {
  components: {
    titlebar1,
    homebody
  },
  mounted() {
    store.remove("closed");
    window.setInterval(() => {
      document.getElementById("notes").innerHTML = "";
      store.each((value, key) => {
        if (
          key != "id" &&
          key != "loglevel:webpack-dev-server" &&
          key != "closed"
        ) {
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
            let id = store.get("id").ids;
            store.set("id", { ids: key });
            ipcRenderer.send("create-new-instance");
            window.setTimeout(() => {
              if (store.get(key).closed == "no") {
                store.set("id", { ids: id });
              }
            }, 700);
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
    /*try {
      window.setTimeout(() => {
        document.getElementById(`startnote`).click();
      }, 100);
    } catch {}
    store.each((value, key) => {
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
      store.set("closed", { closed: "yes" });
      window.setTimeout(() => {
        remote.getCurrentWindow().close();
      }, 700);
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