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
import { setInterval } from "timers";

// Vue Class
export default {
  // Do On Start
  mounted() {
    window.setInterval(() => {
      let color1 = window
        .getComputedStyle(document.getElementById("lightYellow"))
        .getPropertyValue("background-color");
      document.getElementById("backc").style.backgroundColor = color1;
    }, 1);

    // matching Toolbar Color To Note
    window.setInterval(() => {
      document.querySelector(
        ".ql-toolbar"
      ).style.backgroundColor = window
        .getComputedStyle(document.getElementById("lightYellow"))
        .getPropertyValue("background-color");
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
            "underline",
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
            "link",
            "formula",
            "clean",
            "image"
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
        let { remote } = require("electron");
        fs.readFile("data/notes/" + obj.toString(), (e, d) => {
          if (e || JSON.parse(d).deleted == "no") {
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
                  remote.getCurrentWindow().destroy();
                }
              );
            } else {
              fs.unlink("data/notes/" + obj.toString(), e => {});
              remote.getCurrentWindow().destroy();
            }
          }
        });
      };
      window.setInterval(() => {
        fs.readFile("data/notes/" + obj.toString(), (e, d) => {
          if (e) {
          } else {
            try {
              if (JSON.parse(d).deleted == "yes") {
                fs.unlink("data/notes/" + obj.toString(), e => {
                  if (e) {
                    console.log(e);
                  }
                  let { remote } = require("electron");
                  remote.getCurrentWindow().destroy();
                });
              }
            } catch {}
          }
        });
      }, 1);
      quill.on("text-change", () => repeafunc());
      // quill.on("text-change", () => {
      //   let cont = document.querySelector(".ql-snow .ql-editor").innerHTML;
      //   let index = cont.indexOf(
      //     /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
      //   );
      //   if (index >= 0) {
      //     let highcontent =
      //       cont.substring(0, index) +
      //       "<a>" +
      //       cont.substring(index, index + 8) +
      //       "</a>" +
      //       cont.substring(index + 8);
      //     document.querySelector(".ql-snow .ql-editor").innerHTML = highcontent;
      //   }
      // });
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
  }
};
</script>
