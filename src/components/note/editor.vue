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

<!-- Editor Section Of Note Page-->
<!-- Html -->
<template>
  <div>
    <span title="Add Emoji" id="emoji" v-on:click="emoji">&#xE76E;</span>
    <span title="Undo" id="undo">&#xE7A7;</span>
    <span title="Redo" id="redo">&#xE7A6;</span>
    <span id="deletenote1" title="Delete Note">&#xE74D;</span>
    <span title="close" id="hideemoji" v-on:click="hideemoji">&#xE8BB;</span>
    <div id="emojip">
      <picker
        set="google"
        @select="addEmoji"
        title="Pick your emoji…"
        emoji="point_up"
        :style="{
          position: 'absolute',
          top: '40px',
          right: '0',
          zIndex: '7',
          width: '275px',
          height: '335px'
        }"
        :i18n="{
          search: 'Search',
          categories: { search: 'Results Of Your Search', recent: 'Recent' }
        }"
      />
    </div>
    <div id="lightYellow">
      <div id="editor"></div>
    </div>
    <div id="backc"></div>
  </div>
</template>

<!-- Javascript -->
<script>
// Import Required Packages
import Quill from "quill";
import fs from "fs";
import { Picker } from "emoji-mart-vue";

// Vue Class
export default {
  // Components
  components: {
    Picker
  },

  // Do On Start
  mounted() {
    window.setInterval(() => {
      let color1 = window
        .getComputedStyle(document.getElementById("lightYellow"))
        .getPropertyValue("background-color");
      document.getElementById("backc").style.backgroundColor = color1;
      document.querySelector(".ql-toolbar").style.backgroundColor = color1;
    }, 1);

    // Load Editor And Save Note On Several Events
    let BackgroundClass = Quill.import("attributors/class/background");
    let ColorClass = Quill.import("attributors/class/color");
    let SizeStyle = Quill.import("attributors/style/size");
    SizeStyle.whitelist = ["10px", "18px", "27px", "37px"];
    Quill.register(BackgroundClass, true);
    Quill.register(ColorClass, true);
    Quill.register(SizeStyle, true);
    let Font = Quill.import("formats/font");
    Font.whitelist = ["lobster", "comicsans"];
    Quill.register(Font, true);
    let quill = new Quill("#editor", {
      modules: {
        toolbar: [
          [
            { font: ["", "lobster", "comicsans"] },
            { size: ["10px", "18px", "27px", "37px"] },
            "bold",
            "italic",
            "strike",
            { script: "super" },
            { script: "sub" },
            {
              color: [
                "black",
                "white",
                "red",
                "orange",
                "yellow",
                "green",
                "blue",
                "purple"
              ]
            },
            {
              background: [
                "black",
                "white",
                "red",
                "orange",
                "yellow",
                "green",
                "blue",
                "purple"
              ]
            },
            { list: "bullet" },
            { list: "ordered" },
            { align: "" },
            { align: "center" },
            { align: "right" },
            "clean"
          ]
        ],
        history: {
          delay: 1000,
          maxStack: 500,
          userOnly: true
        }
      },
      placeholder: "Add Your Note",
      theme: "snow"
    });
    document.getElementById("undo").addEventListener("click", () => {
      quill.history.undo();
    });
    document.getElementById("redo").addEventListener("click", () => {
      quill.history.redo();
    });
    let func = obj => {
      let repeafunc = () => {
        let text = document.querySelector(".ql-snow .ql-editor").innerHTML;
        let color1 = window
          .getComputedStyle(document.getElementById("lightYellow"))
          .getPropertyValue("background-color");
        let color2 = window
          .getComputedStyle(document.getElementById("titlebar"))
          .getPropertyValue("background-color");
        let winwidth = window.innerWidth.toString();
        let winheight = window.innerHeight.toString();
        let lock;
        if (
          document.getElementById("close-button").style.pointerEvents == "none"
        ) {
          lock = "yes";
        } else {
          lock = "no";
        }
        if (
          document.querySelector(".ql-snow .ql-editor").innerHTML !=
          "<p><br></p>"
        ) {
          fs.writeFile(
            "data/notes/" + obj.toString(),
            JSON.stringify({
              first: text,
              back: color1,
              title: color2,
              wid: winwidth,
              hei: winheight,
              deleted: "no",
              closed: "no",
              locked: lock
            }),
            e => {}
          );
        }
      };
      window.onbeforeunload = e => {
        e.returnValue = true;
        let text = document.querySelector(".ql-snow .ql-editor").innerHTML;
        let color1 = window
          .getComputedStyle(document.getElementById("lightYellow"))
          .getPropertyValue("background-color");
        let color2 = window
          .getComputedStyle(document.getElementById("titlebar"))
          .getPropertyValue("background-color");
        let winwidth = window.innerWidth.toString();
        let winheight = window.innerHeight.toString();
        let lock;
        if (
          document.getElementById("close-button").style.pointerEvents == "none"
        ) {
          lock = "yes";
        } else {
          lock = "no";
        }
        fs.readFile("data/notes/" + obj.toString(), (e, d) => {
          if (e || JSON.parse(d).deleted == "no") {
            let { ipcRenderer } = require("electron");
            if (
              document.querySelector(".ql-snow .ql-editor").innerHTML !=
              "<p><br></p>"
            ) {
              fs.writeFile(
                "data/notes/" + obj.toString(),
                JSON.stringify({
                  first: text,
                  back: color1,
                  title: color2,
                  wid: winwidth,
                  hei: winheight,
                  deleted: "no",
                  closed: "yes",
                  locked: lock
                }),
                e => {
                  ipcRenderer.invoke("destroy");
                }
              );
            } else {
              fs.unlink("data/notes/" + obj.toString(), e => {});
              ipcRenderer.invoke("destroy");
            }
          }
        });
      };
      fs.watch("data/notes/", (e, r) => {
        fs.readFile("data/notes/" + obj.toString(), (e, d) => {
          if (e) {
          } else {
            try {
              if (JSON.parse(d).deleted == "yes") {
                fs.unlink("data/notes/" + obj.toString(), e => {
                  if (e) {
                    console.log(e);
                  }
                  let { ipcRenderer } = require("electron");
                  ipcRenderer.invoke("destroy");
                });
              }
            } catch {}
          }
        });
      });
      quill.on("text-change", () => {
        //TODO

        // if (
        //   /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gm.test(
        //     document.querySelector(".ql-snow .ql-editor").innerHTML
        //   )
        // ) {
        //   document.querySelector(
        //     ".ql-snow .ql-editor"
        //   ).innerHTML = document
        //     .querySelector(".ql-snow .ql-editor")
        //     .innerHTML.replace(
        //       /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gm,
        //       x => {
        //         if (
        //           new RegExp('link-quill">' + x).test(
        //             document.querySelector(".ql-snow .ql-editor").innerHTML
        //           ) ||
        //           new RegExp(x + '" class').test(
        //             document.querySelector(".ql-snow .ql-editor").innerHTML
        //           )
        //         ) {
        //           return x;
        //         } else {
        //           return `<a href="mailto:${x}" class="link-quill">${x}</a>`;
        //         }
        //       }
        //     );
        // }
        // if (
        //   /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim.test(
        //     document.querySelector(".ql-snow .ql-editor").innerHTML
        //   )
        // ) {
        //   document.querySelector(
        //     ".ql-snow .ql-editor"
        //   ).innerHTML = document
        //     .querySelector(".ql-snow .ql-editor")
        //     .innerHTML.replace(
        //       /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim,
        //       x => {
        //         if (
        //           new RegExp(x + "</a>").test(
        //             document.querySelector(".ql-snow .ql-editor").innerHTML
        //           ) ||
        //           new RegExp(x + '" target').test(
        //             document.querySelector(".ql-snow .ql-editor").innerHTML
        //           )
        //         ) {
        //           return x;
        //         } else {
        //           return `<a href="${x}" target="_blank" class="link-quill">${x}</a>`; rag
        //         }
        //       }
        //     );
        // }
        repeafunc();
      });
      document
        .getElementById("color")
        .addEventListener("click", () => repeafunc());
      document
        .getElementById("changec")
        .addEventListener("click", () => repeafunc());
      document
        .getElementById("locks")
        .addEventListener("click", () => repeafunc());
      window.addEventListener("resize", () => repeafunc());
    };
    fs.readFile("data/id", (e, d) => {
      if (e) {
        let id = 1;
        func(id);
      } else {
        let id = Number(JSON.parse(d).ids);
        func(id);
      }
    });
  },
  methods: {
    // Add emoji
    addEmoji(e) {
      document.querySelector(
        ".ql-snow .ql-editor"
      ).lastElementChild.innerHTML += e.native;
    },
    // Add Emoji
    emoji() {
      document.getElementsByClassName("emoji-mart")[0].style.visibility =
        "visible";
      document.getElementById("hideemoji").style.display = "block";
    },
    // Hide Emoji
    hideemoji() {
      document.getElementsByClassName("emoji-mart")[0].style.visibility =
        "hidden";
      document.getElementById("hideemoji").style.display = "none";
    }
  }
};
</script>
