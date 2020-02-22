<!--
MIT License

Copyright (c) 2020 Playork

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
    <titlebar v-bind:close="close" v-bind:note="note" v-bind:minimize="minimize" />
    <editor />
    <colors />
    <choosecolor />
  </div>
</template>

<!-- Javascript -->
<script>
// Import Required Packages
import { ipcRenderer } from "electron";
import fs from "fs";
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
    // Delete Note
    fs.readFile(".data-sn/id", (e, d) => {
      if (e) {
      } else {
        let noteid = JSON.parse(d).ids;
        document.getElementById("deletenote").addEventListener("click", () => {
          fs.readFile(".data-sn/id", (e, r) => {
            if (e) {
            } else {
              if (JSON.parse(r).on == "yes") {
                let swal = require("sweetalert");
                swal({
                  title: "Are you sure?",
                  text: "Want To Delete Your Note!",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true
                }).then(willDelete => {
                  if (willDelete) {
                    fs.unlink(".data-sn/notes/" + noteid, e => {});
                    ipcRenderer.invoke("destroy");
                  }
                });
              } else {
                fs.unlink(".data-sn/notes/" + noteid, e => {});
                ipcRenderer.invoke("destroy");
              }
            }
          });
        });
      }
    });

    // Close For Main Process Close
    ipcRenderer.on("closenote", () => {
      ipcRenderer.invoke("close");
    });

    //theme change
    fs.watch(".data-sn/theme", (e, r) => {
      fs.readFile(".data-sn/theme", (e, d) => {
        let num = JSON.parse(d).on;
        if (num == 1) {
          let lith = document.createElement("style");
          lith.type = "text/css";
          lith.id = "lighttheme";
          lith.innerText = `
  #note {
    background: #ffffffee;
  }
  .swal-modal {
    background: #ffffffee !important;
  }
  .swal-title,
  .swal-text {
    color: #000 !important;
  }
  .dropdown-content {
    background-color: #ffffffee !important;
  }
  .dropdown-content a {
    color: #000 !important;
  }
  .dropdown-content a:hover {
    background-color: #eee !important;
  }
  #choosecolor {
    background: #ffffffee !important;
    color: #000 !important;
  }
  #window-title2 span:hover {
    color: #000 !important;
  }`;
          document.head.appendChild(lith);
        } else {
          try {
            document.head.removeChild(document.getElementById("lighttheme"));
          } catch {}
        }
      });
    });

    //closing home
    fs.watch(".data-sn", (e, r) => {
      fs.readFile(".data-sn/closed", (e, d) => {
        if (e) {
        } else {
          if (JSON.parse(d).closed == "yes") {
            ipcRenderer.invoke("close");
          }
        }
      });
    });

    // Restore Saved Note
    fs.readFile(".data-sn/id", (e, d) => {
      if (e) {
      } else {
        fs.readFile(".data-sn/notes/" + JSON.parse(d).ids, (e, r) => {
          if (e) {
            window.resizeTo(300, 325);
            document.querySelector(".ql-toolbar").style.backgroundColor =
              "#FFF2AB";
          } else {
            let text = JSON.parse(r);
            document.querySelector(".ql-snow .ql-editor").innerHTML =
              text.first;
            document.querySelector(".ql-toolbar").style.backgroundColor =
              text.back;
            window.resizeTo(Number(text.wid), Number(text.hei));
            document.getElementById("lightYellow").style.backgroundColor =
              text.back;
            document.getElementById("titlebar").style.backgroundColor =
              text.title;
          }
        });
      }
    });
    fs.readFile(".data-sn/color", (e, d) => {
      if (JSON.parse(d).on == "no") {
        document.getElementById("color").style.visibility = "hidden";
      } else {
        document.getElementById("color").style.visibility = "visible";
      }
    });
  },

  // Functions
  methods: {
    // Close Function
    close() {
      ipcRenderer.invoke("close");
    },

    // Start New Note
    note() {
      let func = obj => {
        obj++;
        fs.writeFile(
          ".data-sn/id",
          JSON.stringify({ ids: obj.toString() }),
          e => {}
        );
      };
      fs.readFile(".data-sn/id", (e, d) => {
        if (e) {
          let id = 1;
          func(id);
        } else {
          let id = Number(JSON.parse(d).ids);
          func(id);
        }
      });
      ipcRenderer.send("create-new-instance");
    },

    // Minimize Function
    minimize() {
      ipcRenderer.invoke("minimize");
    },

    // Focus Blur Event Function
    showhide() {
      document.addEventListener(
        "focus",
        () => {
          document.getElementById("lightYellow").style.paddingTop = "30px";
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
          document.getElementById("minimize").style.display = "flex";
          document.getElementById("close").style.display = "flex";
          document.getElementById("menu").style.display = "flex";
        },
        true
      );
      document.addEventListener(
        "click",
        e => {
          document.getElementById("lightYellow").style.paddingTop = "30px";
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
          document.getElementById("minimize").style.display = "flex";
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
          document.getElementById("minimize").style.display = "none";
          document.getElementById("close").style.display = "none";
          document.getElementById("menu").style.display = "none";
        },
        true
      );
    }
  }
};
</script>
