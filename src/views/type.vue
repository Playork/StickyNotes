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
  <div id="note" v-on:click="showhide">
    <titlebar
      v-bind:close="close"
      v-bind:note="note"
      v-bind:minimize="minimize"
    />
    <colors />
    <choosecolor />
    <span title="Undo" id="undo">&#xE7A7;</span>
    <span title="Redo" id="redo">&#xE7A6;</span>
    <span id="deletenote1" title="Delete Note">&#xE74D;</span>
    <div id="lightYellow">
      <div id="editor"></div>
    </div>
  </div>
</template>

<!-- Javascript -->
<script>
// Import Required Packages
import Quill from "quill";
import fs from "fs";
import { ipcRenderer } from "electron";
import titlebar from "../components/note/titlebar.vue";
import colors from "../components/note/colors.vue";
import choosecolor from "../components/note/choosecolor.vue";

// Vue Class
export default {
  // Components
  components: {
    titlebar,
    colors,
    choosecolor
  },

  // Do On Start
  mounted() {
    //  Profile
    fs.readFile("data/profile", (e, d) => {
      let profile = d;

      // Close For Main Process Close
      ipcRenderer.on("closenote", () => {
        ipcRenderer.invoke("close");
      });

      //closing home
      fs.watch("data/" + profile, (e, r) => {
        fs.readFile("data/" + profile + "/closed", (e, d) => {
          if (e) {
          } else {
            if (JSON.parse(d).closed == "yes") {
              ipcRenderer.invoke("close");
            }
          }
        });
      });

      //theme change
      fs.watch("data/theme", (e, r) => {
        fs.readFile("data/theme", (e, d) => {
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
  }
 #undo,#redo,#deletenote1{
    color:#000;
    background:#ffffffee;
  }`;
            document.head.appendChild(lith);
          } else {
            try {
              document.head.removeChild(document.getElementById("lighttheme"));
            } catch {}
          }
        });
      });

      window.setInterval(() => {
        let color1 = window
          .getComputedStyle(document.getElementById("lightYellow"))
          .getPropertyValue("background-color");
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
        quill.history.undo();
      });
      document.getElementById("redo").addEventListener("click", () => {
        quill.history.redo();
      });
      document.addEventListener("keydown", k => {
        if (k.key == "y" && k.ctrlKey) {
          quill.history.redo();
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
            }
          );
        }
      });
      let importnote = async () => {
        let note = await ipcRenderer.invoke("importnote");
        if (note) {
          fs.readFile(note, (e, d) => {
            if (e) {
              let swal = require("sweetalert");
              swal("Not Supported");
            } else {
              d = d.toString().split("\n");
              document.querySelector(".ql-snow .ql-editor").innerHTML = d[0];
              window.resizeTo(Number(d[3]), Number([4]));
              document.getElementById("lightYellow").style.backgroundColor =
                d[1];
              document.getElementById("titlebar").style.backgroundColor = d[2];
            }
          });
        }
      };
      // Import Note Function
      document.getElementById("import").addEventListener("click", () => {
        importnote();
      });
      document.addEventListener("keydown", k => {
        if (k.key == "i" && k.ctrlKey) {
          importnote();
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
                  ipcRenderer.invoke("destroy");
                });
              }
            });
          }
        });

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
            document.getElementById("close-button").style.pointerEvents ==
            "none"
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
        };
        window.onbeforeunload = async e => {
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
      document.addEventListener("paste", () => {
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
                let cont = document.querySelector(".ql-snow .ql-editor")
                  .innerHTML;
                document.querySelector(".ql-snow .ql-editor").innerHTML =
                  cont.substring(0, matches[match]["index"]) +
                  `<a target="_blank" class="link-quill" href="${matches[match][0]}">${matches[match][0]}</a>` +
                  cont.substring(
                    matches[match]["index"] + matches[match][0].length
                  );
                links.push(matches[match][0]);
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
                let cont = document.querySelector(".ql-snow .ql-editor")
                  .innerHTML;
                document.querySelector(".ql-snow .ql-editor").innerHTML =
                  cont.substring(0, matches[match]["index"]) +
                  `<a target="_blank" class="link-quill" href="${matches[match][0]}">${matches[match][0]}</a>` +
                  cont.substring(
                    matches[match]["index"] + matches[match][0].length
                  );
                mails.push(matches[match][0]);
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
              }
            }
          }
        } else {
          mails = [];
        }
      });
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
                console.log(matches);
                for (let match in matches) {
                  if (!links.includes(matches[match][0])) {
                    let cont = document.querySelector(".ql-snow .ql-editor")
                      .innerHTML;
                    document.querySelector(".ql-snow .ql-editor").innerHTML =
                      cont.substring(0, matches[match]["index"]) +
                      `<a target="_blank" class="link-quill" href="${matches[match][0]}">${matches[match][0]}</a>` +
                      cont.substring(
                        matches[match]["index"] + matches[match][0].length
                      );
                    links.push(matches[match][0]);
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
                    let cont = document.querySelector(".ql-snow .ql-editor")
                      .innerHTML;
                    document.querySelector(".ql-snow .ql-editor").innerHTML =
                      cont.substring(0, matches[match]["index"]) +
                      `<a target="_blank" class="link-quill" href="${matches[match][0]}">${matches[match][0]}</a>` +
                      cont.substring(
                        matches[match]["index"] + matches[match][0].length
                      );
                    mails.push(matches[match][0]);
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
  // Functions
  methods: {
    close() {
      ipcRenderer.invoke("close");
    },

    // Start New Note
    note() {
      fs.readFile("data/profile", (e, d) => {
        let profile = d;
        let func = obj => {
          obj++;
          fs.writeFile(
            "data/" + profile + "/id",
            JSON.stringify({ ids: obj.toString() }),
            e => {}
          );
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
        ipcRenderer.send("create-new-instance");
      });
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
          if (document.getElementById("lock") == "&#xE785;") {
            document.getElementById("titlebar").style.height = "32px";
            document.getElementById("lightYellow").style.paddingTop = "30px";
            if (
              document.querySelector(".ql-snow.ql-toolbar").style.display !=
              "block"
            ) {
              document.getElementById("color").style.height = "40px";
            }
            document.getElementById("redo").style.display = "block";
            document.getElementById("lock").style.display = "flex";
            document.getElementById("add").style.display = "flex";
            document.getElementById("more").style.display = "flex";
            document.getElementById("minimize").style.display = "flex";
            document.getElementById("close").style.display = "flex";
            document.getElementById("menu").style.display = "flex";
            document.getElementById("undo").style.display = "block";
            document.getElementById("deletenote1").style.display = "block";
          }
        },
        true
      );
      document.addEventListener(
        "click",
        e => {
          if (document.getElementById("lock") == "&#xE785;") {
            document.getElementById("titlebar").style.height = "32px";
            document.getElementById("lightYellow").style.paddingTop = "30px";
            if (
              document.querySelector(".ql-snow.ql-toolbar").style.display !=
              "block"
            ) {
              document.getElementById("color").style.height = "40px";
            }
            document.getElementById("redo").style.display = "block";
            document.getElementById("lock").style.display = "flex";
            document.getElementById("add").style.display = "flex";
            document.getElementById("more").style.display = "flex";
            document.getElementById("minimize").style.display = "flex";
            document.getElementById("close").style.display = "flex";
            document.getElementById("menu").style.display = "flex";
            document.getElementById("undo").style.display = "block";
            document.getElementById("deletenote1").style.display = "block";
            if (!e.target.matches("#menus")) {
              let dropdowns = document.getElementById("menu-content");
              if (dropdowns.classList.contains("show")) {
                dropdowns.classList.remove("show");
              }
            }
          }
        },
        true
      );
      document.addEventListener(
        "blur",
        () => {
          if (document.getElementById("lock") == "&#xE785;") {
            document.getElementById("titlebar").style.height = "0";
            document.getElementById("color").style.height = "0";
            document.getElementById("lock").style.display = "none";
            document.getElementById("add").style.display = "none";
            document.getElementById("more").style.display = "none";
            document.getElementById("minimize").style.display = "none";
            document.getElementById("close").style.display = "none";
            document.getElementById("menu").style.display = "none";
            document.getElementById("redo").style.display = "none";
            document.getElementById("undo").style.display = "none";
            document.getElementById("deletenote1").style.display = "none";
          }
        },
        true
      );
    }
  }
};
</script>
