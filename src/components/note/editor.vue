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
    <div id="candit">
      <button id="paintclear" class="button1">Clear</button>
      <span class="info">2</span
      ><input
        type="range"
        value="2"
        min="2"
        max="50"
        id="paintwidth"
        class="brushwidth"
      />
      <input type="color" value="#000" id="paintcolor" />
    </div>
    <canvas id="draw"></canvas>
  </div>
</template>

<!-- Javascript -->
<script>
// Import Required Packages
import Quill from "quill";
import fs from "fs";
import { Picker } from "emoji-mart-vue";
import { ipcRenderer } from "electron";
import { fabric } from "fabric";

// Vue Class
export default {
  // Components
  components: {
    Picker
  },

  // Do On Start
  mounted() {
    document.addEventListener("keydown", k => {
      if (k.key == "e" && k.ctrlKey) {
        this.emoji();
      }
    });

    //  Profile
    fs.readFile("data/profile", (e, d) => {
      let profile = d;

      // draw
      let canvas = new fabric.Canvas("draw", {
        backgroundColor: "transparent",
        freeDrawingCursor: "pointer",
        isDrawingMode: true
      });
      let drawingColorEl = document.getElementById("paintcolor");
      let drawingLineWidthEl = document.getElementById("paintwidth");
      document.getElementById("paintclear").onclick = function() {
        canvas.clear();
      };
      drawingColorEl.onchange = function() {
        canvas.freeDrawingBrush.color = drawingColorEl.value;
      };
      drawingLineWidthEl.onchange = function() {
        canvas.freeDrawingBrush.width =
          parseInt(drawingLineWidthEl.value, 10) || 1;
        drawingLineWidthEl.previousSibling.innerHTML = drawingLineWidthEl.value;
      };
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = drawingColorEl.value;
        canvas.freeDrawingBrush.width =
          parseInt(drawingLineWidthEl.value, 10) || 1;
      }
      function resizeCanvas() {
        canvas.setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
      window.addEventListener("resize", resizeCanvas, false);
      resizeCanvas();

      window.setInterval(() => {
        let color1 = window
          .getComputedStyle(document.getElementById("lightYellow"))
          .getPropertyValue("background-color");
        document.getElementById("backc").style.backgroundColor = color1;
        try {
          document.querySelector(".ql-toolbar").style.backgroundColor = color1;
        } catch {}
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
        if (document.getElementById("draw").style.display != "block") {
          quill.history.undo();
        } else {
          if (
            canvas.item(canvas.getObjects().length - 1) &&
            canvas.item(canvas.getObjects().length - 1).get("type") === "path"
          ) {
            canvas.remove(canvas.item(canvas.getObjects().length - 1));
            canvas.renderAll();
          }
        }
      });
      document.getElementById("redo").addEventListener("click", () => {
        quill.history.redo();
      });
      document.addEventListener("keydown", k => {
        if (k.key == "y" && k.ctrlKey) {
          if (document.getElementById("draw").style.display != "block") {
            quill.history.undo();
          } else {
            if (
              canvas.item(canvas.getObjects().length - 1) &&
              canvas.item(canvas.getObjects().length - 1).get("type") === "path"
            ) {
              canvas.remove(canvas.item(canvas.getObjects().length - 1));
              canvas.renderAll();
            }
          }
        }
      });

      // Restore Saved Note
      fs.readFile("data/" + profile + "/id", (e, d) => {
        if (e) {
        } else {
          fs.readFile(
            "data/" + profile + "/notes/" + JSON.parse(d).ids,
            (e, r) => {
              if (e) {
                window.resizeTo(300, 325);
                document.querySelector(".ql-toolbar").style.backgroundColor =
                  "#FFF2AB";
              } else {
                let text = JSON.parse(r);
                if (!text.first) {
                  document.getElementById("mouch").click();
                  canvas.setBackgroundImage(
                    text.image,
                    canvas.renderAll.bind(canvas),
                    {
                      originX: "left",
                      originY: "top"
                    }
                  );
                } else {
                  document.querySelector(".ql-snow .ql-editor").innerHTML =
                    text.first;
                }
                document.querySelector(".ql-toolbar").style.backgroundColor =
                  text.back;
                window.resizeTo(Number(text.wid), Number(text.hei));
                document.getElementById("lightYellow").style.backgroundColor =
                  text.back;
                document.getElementById("titlebar").style.backgroundColor =
                  text.title;
              }
            }
          );
        }
      });

      // Import Note Function
      document.getElementById("import").addEventListener("click", async () => {
        let notes = await ipcRenderer.invoke("importnote");
        if (note.filePaths[0]) {
          let fs = require("fs");
          fs.readFile(note.filePaths[0], (e, d) => {
            if (e) {
              let swal = require("sweetalert");
              swal("Not Supported");
            } else {
              d = d.toString().split("\n");
              if (
                document.querySelector(".lower-canvas").style.display != "block"
              ) {
                document.querySelector(".ql-snow .ql-editor").innerHTML = d[0];
                window.resizeTo(Number(d[3]), Number([4]));
              } else {
                window.resizeTo(Number(d[3]), Number([4]));
                canvas.setBackgroundImage(d[0], canvas.renderAll.bind(canvas), {
                  originX: "left",
                  originY: "top"
                });
              }
              document.getElementById("lightYellow").style.backgroundColor =
                d[1];
              document.getElementById("titlebar").style.backgroundColor = d[2];
            }
          });
        }
      });

      let func = obj => {
        // Delete Note
        document.getElementById("deletenote1").addEventListener("click", () => {
          let swal = require("sweetalert");
          swal({
            title: "Are you sure?",
            text: "Want To Delete Your Note!",
            icon: "warning",
            buttons: true,
            dangerMode: true
          }).then(willDelete => {
            if (willDelete) {
              fs.unlink("data/" + profile + "/notes/" + obj.toString(), e => {
                let { ipcRenderer } = require("electron");
                ipcRenderer.invoke("destroy");
              });
            }
          });
        });
        document.addEventListener("keydown", k => {
          if (k.key == "d" && k.ctrlKey) {
            let swal = require("sweetalert");
            swal({
              title: "Are you sure?",
              text: "Want To Delete Your Note!",
              icon: "warning",
              buttons: true,
              dangerMode: true
            }).then(willDelete => {
              if (willDelete) {
                fs.unlink("data/" + profile + "/notes/" + obj.toString(), e => {
                  let { ipcRenderer } = require("electron");
                  ipcRenderer.invoke("destroy");
                });
              }
            });
          }
        });

        let repeafunc = () => {
          let text = document.querySelector(".ql-snow .ql-editor").innerHTML;
          let url = document.querySelector(".lower-canvas").toDataURL();
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
            document.getElementById("close-button").style.pointerEvents ==
            "none"
          ) {
            lock = "yes";
          } else {
            lock = "no";
          }
          if (document.getElementById("lightYellow").style.display != "none") {
            if (
              document.querySelector(".ql-snow .ql-editor").innerHTML !=
              "<p><br></p>"
            ) {
              fs.writeFile(
                "data/" + profile + "/notes/" + obj.toString(),
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
          } else {
            fs.writeFile(
              "data/" + profile + "/notes/" + obj.toString(),
              JSON.stringify({
                image: url,
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
        window.onbeforeunload = async e => {
          e.returnValue = true;
          let text = document.querySelector(".ql-snow .ql-editor").innerHTML;
          let url = document.querySelector(".lower-canvas").toDataURL();
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
            document.getElementById("close-button").style.pointerEvents ==
            "none"
          ) {
            lock = "yes";
          } else {
            lock = "no";
          }
          fs.readFile(
            "data/" + profile + "/notes/" + obj.toString(),
            (e, d) => {
              if (e || JSON.parse(d).deleted == "no") {
                let { ipcRenderer } = require("electron");
                if (
                  document.getElementById("lightYellow").style.display != "none"
                ) {
                  if (
                    document.querySelector(".ql-snow .ql-editor").innerHTML !=
                    "<p><br></p>"
                  ) {
                    fs.writeFile(
                      "data/" + profile + "/notes/" + obj.toString(),
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
                    fs.unlink(
                      "data/" + profile + "/notes/" + obj.toString(),
                      e => {}
                    );
                    ipcRenderer.invoke("destroy");
                  }
                } else {
                  fs.writeFile(
                    "data/" + profile + "/notes/" + obj.toString(),
                    JSON.stringify({
                      image: url,
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
                }
              }
            }
          );
        };
        fs.watch("data/" + profile + "/notes/", (e, r) => {
          fs.readFile(
            "data/" + profile + "/notes/" + obj.toString(),
            (e, d) => {
              if (e) {
              } else {
                try {
                  if (JSON.parse(d).deleted == "yes") {
                    fs.unlink(
                      "data/" + profile + "/notes/" + obj.toString(),
                      e => {
                        if (e) {
                          console.log(e);
                        }
                        let { ipcRenderer } = require("electron");
                        ipcRenderer.invoke("destroy");
                      }
                    );
                  }
                } catch {}
              }
            }
          );
        });
        quill.on("text-change", () => {
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
        let rfunc = () => {
          if (document.getElementById("draw") == "block") {
            repeafunc();
          }
        };
        document
          .getElementById("note")
          .addEventListener("mousemove", () => rfunc(), false);
        document
          .getElementById("note")
          .addEventListener("mouseup", () => rfunc());
        document
          .getElementById("note")
          .addEventListener("mouseleave", () => rfunc(), false);
        document
          .getElementById("note")
          .addEventListener("mouseenter", () => rfunc(), false);
        document
          .getElementById("note")
          .addEventListener("mousedown", () => rfunc(), false);
        document
          .getElementById("note")
          .addEventListener("mouseout", () => rfunc(), false);
        document
          .getElementById("note")
          .addEventListener("touchstart", () => rfunc(), false);
        document
          .getElementById("note")
          .addEventListener("touchmove", () => rfunc(), false);
        document
          .getElementById("note")
          .addEventListener("touchend", () => rfunc(), false);
        document
          .getElementById("note")
          .addEventListener("touchcancel", () => rfunc(), false);
        document
          .getElementById("note")
          .addEventListener("touchleave", () => rfunc(), false);
      };
      fs.readFile("data/" + profile + "/id", (e, d) => {
        if (e) {
          let id = 1;
          func(id);
        } else {
          let id = Number(JSON.parse(d).ids);
          func(id);
        }
      });
      let links = [];
      let mails = [];
      window.setTimeout(() => {
        document
          .querySelectorAll('a[href^="http"][target="_blank"]')
          .forEach(a => {
            let { shell } = require("electron");
            a.addEventListener("input", e => {
              let old = e.srcElement.href;
              if (e.srcElement.innerHTML == "") {
                links = links.map(function(x) {
                  return x.replace(
                    new RegExp(old, "i"),
                    e.srcElement.innerHTML
                  );
                });
              } else {
                links = links.map(x => {
                  if (x != old) {
                    return x;
                  }
                });
              }
              e.srcElement.href = e.srcElement.innerHTML;
            });
            a.addEventListener("click", function(e) {
              e.preventDefault();
              shell.openExternal(e.srcElement.innerHTML);
            });
          });
        document
          .querySelectorAll('a[href^="mailto"][target="_blank"]')
          .forEach(a => {
            let { shell } = require("electron");
            a.addEventListener("input", e => {
              let old = e.srcElement.href;
              if (e.srcElement.innerHTML == "") {
                mails = mails.map(function(x) {
                  return x.replace(
                    new RegExp(old, "i"),
                    `mailto:${e.srcElement.innerHTML}`
                  );
                });
              } else {
                mails = mails.map(x => {
                  if (`mailto:${x}` != old) {
                    return x;
                  }
                });
              }
              e.srcElement.href = `mailto:${e.srcElement.innerHTML}`;
            });
            a.addEventListener("click", function(e) {
              e.preventDefault();
              shell.openExternal(`mailto:${e.srcElement.innerHTML}`);
            });
          });
        let matchesl = Array.from(
          document
            .querySelector(".ql-snow .ql-editor")
            .innerHTML.matchAll(
              /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim
            )
        );
        for (let matchl in matchesl) {
          if (!links.includes(matchesl[matchl][0])) {
            links.push(matchesl[matchl][0]);
          }
        }
        let matchesm = Array.from(
          document
            .querySelector(".ql-snow .ql-editor")
            .innerHTML.matchAll(
              /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gim
            )
        );
        for (let matchm in matchesm) {
          if (!mailsm.includes(matchesm[matchm][0])) {
            mails.push(matchesm[matchm][0]);
          }
        }
      }, 2000);
      document
        .querySelector(".ql-snow .ql-editor")
        .addEventListener("keyup", e => {
          if (
            e.keyCode == 8 &&
            e.keyCode !== 9 &&
            e.keyCode !== 13 &&
            e.keyCode !== 32 &&
            e.keyCode !== 46
          ) {
            return;
          }
          if (e.keyCode == 17) {
            return;
          }
          if (
            e.keyCode == 13 ||
            e.keyCode == 10 ||
            e.keyCode == 9 ||
            e.keyCode == 32 ||
            e.keyCode == 46
          ) {
            if (
              /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/im.test(
                document.querySelector(".ql-snow .ql-editor").innerHTML
              )
            ) {
              let narr = document
                .querySelector(".ql-snow .ql-editor")
                .innerHTML.matchAll(
                  /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim
                );
              let matches = Array.from(narr);
              if (matches != []) {
                for (let match in matches) {
                  if (!links.includes(matches[match][0])) {
                    document.querySelector(
                      ".ql-snow .ql-editor"
                    ).innerHTML = document
                      .querySelector(".ql-snow .ql-editor")
                      .innerHTML.replace(
                        new RegExp(matches[match][0], "im"),
                        u => {
                          links.push(u);
                          return `<a target="_blank" class="link-quill" href="${u}">${u}</a>`;
                        }
                      );
                    document
                      .querySelectorAll('a[href^="http"][target="_blank"]')
                      .forEach(a => {
                        let { shell } = require("electron");
                        a.addEventListener("input", e => {
                          let old = e.srcElement.href;
                          if (e.srcElement.innerHTML == "") {
                            links = links.map(function(x) {
                              return x.replace(
                                new RegExp(old, "i"),
                                e.srcElement.innerHTML
                              );
                            });
                          } else {
                            links = links.map(x => {
                              if (x != old) {
                                return x;
                              }
                            });
                          }
                          e.srcElement.href = e.srcElement.innerHTML;
                        });
                        a.addEventListener("click", function(e) {
                          e.preventDefault();
                          shell.openExternal(e.srcElement.innerHTML);
                        });
                      });
                  }
                }
              }
            } else {
              links = [];
            }
            if (
              /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/im.test(
                document.querySelector(".ql-snow .ql-editor").innerHTML
              )
            ) {
              let narr = document
                .querySelector(".ql-snow .ql-editor")
                .innerHTML.matchAll(
                  /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gim
                );
              let matches = Array.from(narr);
              if (matches != []) {
                for (let match in matches) {
                  if (!mails.includes(matches[match][0])) {
                    document.querySelector(
                      ".ql-snow .ql-editor"
                    ).innerHTML = document
                      .querySelector(".ql-snow .ql-editor")
                      .innerHTML.replace(
                        new RegExp(matches[match][0], "im"),
                        u => {
                          mails.push(u);
                          return `<a target="_blank" class="link-quill" href="mailto:${u}">${u}</a>`;
                        }
                      );
                    document
                      .querySelectorAll('a[href^="mailto"][target="_blank"]')
                      .forEach(a => {
                        let { shell } = require("electron");
                        a.addEventListener("input", e => {
                          let old = e.srcElement.href;
                          if (e.srcElement.innerHTML == "") {
                            mails = mails.map(function(x) {
                              return x.replace(
                                new RegExp(old, "i"),
                                `mailto:${e.srcElement.innerHTML}`
                              );
                            });
                          } else {
                            mails = mails.map(x => {
                              if (`mailto:${x}` != old) {
                                return x;
                              }
                            });
                          }
                          e.srcElement.href = `mailto:${e.srcElement.innerHTML}`;
                        });
                        a.addEventListener("click", function(e) {
                          e.preventDefault();
                          shell.openExternal(
                            `mailto:${e.srcElement.innerHTML}`
                          );
                        });
                      });
                  }
                }
              }
            } else {
              mails = [];
            }
          }
        });
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
