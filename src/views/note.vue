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

<!-- Note Page-->
<!-- Html -->
<template>
  <div id="note" v-on:click="showhide">
    <titlebar v-bind:close="close" v-bind:note="note"/>
    <editor/>
    <colors/>
    <choosecolor/>
  </div>
</template>

<!-- Javascript -->
<script>
// Import Required Packages
import { remote, ipcRenderer } from "electron";
import store from "store";
import swal from "sweetalert";
import editor from "../components/note/editor.vue";
import titlebar from "../components/note/titlebar.vue";
import colors from "../components/note/colors.vue";
import choosecolor from "../components/note/choosecolor.vue";

// Vue Class
export default {
  // Components
  components: {
    titlebar,
    editor,
    colors,
    choosecolor
  },

  // Do On Start
  mounted() {
    // Close For Main Process Close
    ipcRenderer.on("closenote", () => {
      remote.getCurrentWindow().close();
    });

    // Close When Closing Home
    window.setInterval(() => {
      try {
        if (store.get("closed").closed == "yes") {
          remote.getCurrentWindow().close();
        }
      } catch {}
    }, 1);

    // Restore Saved Note
    try {
      let text = store.get(store.get("id").ids);
      window.resizeTo(Number(text.wid), Number(text.hei));
      if (text.first == undefined) {
        document.getElementById("mouch").click();
        let canvas = document.getElementById("draw");
        let ctx = canvas.getContext("2d");

        let img = new Image();
        img.src = text.image;
        img.onload = function() {
          window.setTimeout(() => {
            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
          }, 50);
        };
      } else {
        document.querySelector(".ql-snow .ql-editor").innerHTML = text.first;
      }
      document.getElementById("lightYellow").style.backgroundColor = text.back;
      document.getElementById("titlebar").style.backgroundColor = text.title;
      document.querySelector(".ql-toolbar").style.backgroundColor = text.back;
    } catch {
      window.resizeTo(350, 375);
      document.querySelector(".ql-toolbar").style.backgroundColor = "#FFF2AB";
    }
    if (
      document.querySelector(".ql-snow .ql-editor").innerHTML != "<p><br></p>"
    ) {
      document.getElementById("window-title1").style.pointerEvents = "none";
    }
  },

  // Functions
  methods: {
    // Close Function
    close() {
      remote.getCurrentWindow().close();
    },

    // Start New Note
    note() {
      let func = obj => {
        obj++;
        store.set("id", { ids: obj.toString() });
      };
      try {
        let id = Number(store.get("id").ids);
        func(id);
      } catch {
        let id = 1;
        func(id);
      }
      ipcRenderer.send("create-new-instance");
    },

    // Focus Blur Event Function
    showhide() {
      document.addEventListener(
        "focus",
        () => {
          document.getElementById("titlebar").style.height = "32px";
          if (
            document.querySelector(".ql-snow.ql-toolbar").style.display !=
            "block"
          ) {
            document.getElementById("color").style.height = "40px";
          }
          document.getElementById("lock").style.display = "flex";
          document.getElementById("add").style.display = "flex";
          document.getElementById("more").style.display = "flex";
          document.getElementById("close").style.display = "flex";
          document.getElementById("menu").style.display = "flex";
        },
        true
      );
      document.addEventListener(
        "click",
        e => {
          document.getElementById("titlebar").style.height = "32px";
          if (
            document.querySelector(".ql-snow.ql-toolbar").style.display !=
            "block"
          ) {
            document.getElementById("color").style.height = "40px";
          }
          document.getElementById("lock").style.display = "flex";
          document.getElementById("add").style.display = "flex";
          document.getElementById("more").style.display = "flex";
          document.getElementById("close").style.display = "flex";
          document.getElementById("menu").style.display = "flex";
          if (!e.target.matches("#menus")) {
            let dropdowns = document.getElementById("menu-content");
            if (dropdowns.classList.contains("show")) {
              dropdowns.classList.remove("show");
            }
          }
        },
        true
      );
      document.addEventListener(
        "blur",
        () => {
          document.getElementById("titlebar").style.height = "0";
          document.getElementById("color").style.height = "0";
          document.getElementById("lock").style.display = "none";
          document.getElementById("add").style.display = "none";
          document.getElementById("more").style.display = "none";
          document.getElementById("close").style.display = "none";
          document.getElementById("menu").style.display = "none";
        },
        true
      );
    }
  }
};
</script>
