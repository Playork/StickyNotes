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

<script>
// Import Required Packages
import fs from "fs";
import { ipcRenderer } from "electron";
import { fabric } from "../assets/script/fabric";
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

      // draw
      let canvas = new fabric.Canvas("draw", {
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
      let redo = [];
      document.getElementById("undo").addEventListener("click", () => {
        if (
          canvas.item(canvas.getObjects().length - 1) &&
          canvas.item(canvas.getObjects().length - 1).get("type") === "path"
        ) {
          redo.push(canvas.item(canvas.getObjects().length - 1));
          canvas.remove(canvas.item(canvas.getObjects().length - 1));
          canvas.renderAll();
        }
      });
      document.getElementById("redo").addEventListener("click", () => {
        if (redo != []) {
          canvas.add(redo.pop());
          canvas.renderAll();
        }
      });
      document.addEventListener("keydown", k => {
        if (k.key == "z" && k.ctrlKey) {
          if (
            canvas.item(canvas.getObjects().length - 1) &&
            canvas.item(canvas.getObjects().length - 1).get("type") === "path"
          ) {
            redo.push(canvas.item(canvas.getObjects().length - 1));
            canvas.remove(canvas.item(canvas.getObjects().length - 1));
            canvas.renderAll();
          }
        }
      });
      document.addEventListener("keydown", k => {
        if (k.key == "y" && k.ctrlKey) {
          if (redo != []) {
            canvas.add(redo.pop());
            canvas.renderAll();
          }
        }
      });

      // secret feature
      document.addEventListener("drop", e => {
        fabric.Image.fromURL(
          `file:///${e.dataTransfer.files[0].path}`,
          myImg => {
            var img1 = myImg.set({
              left: 0,
              top: 40
            });
            canvas.add(img1);
            canvas.renderAll();
          }
        );
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
              } else {
                let text = JSON.parse(r);
                canvas.setBackgroundImage(
                  text.image,
                  canvas.renderAll.bind(canvas),
                  {
                    originX: "left",
                    originY: "top"
                  }
                );
                window.resizeTo(Number(text.wid), Number(text.hei));
                document.getElementById("backc").style.backgroundColor =
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
              window.resizeTo(Number(d[3]), Number([4]));
              canvas.setBackgroundImage(d[0], canvas.renderAll.bind(canvas), {
                originX: "left",
                originY: "top"
              });
              document.getElementById("backc").style.backgroundColor = d[1];
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
          let url = document.querySelector(".lower-canvas").toDataURL();
          let color1 = window
            .getComputedStyle(document.getElementById("backc"))
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
        };
        window.onbeforeunload = async e => {
          e.returnValue = true;
          let url = document.querySelector(".lower-canvas").toDataURL();
          let color1 = window
            .getComputedStyle(document.getElementById("backc"))
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
        document
          .getElementById("note")
          .addEventListener("mousemove", () => repeafunc(), false);
        document
          .getElementById("note")
          .addEventListener("mouseup", () => repeafunc());
        document
          .getElementById("note")
          .addEventListener("mouseleave", () => repeafunc(), false);
        document
          .getElementById("note")
          .addEventListener("mouseenter", () => repeafunc(), false);
        document
          .getElementById("note")
          .addEventListener("mousedown", () => repeafunc(), false);
        document
          .getElementById("note")
          .addEventListener("mouseout", () => repeafunc(), false);
        document
          .getElementById("note")
          .addEventListener("touchstart", () => repeafunc(), false);
        document
          .getElementById("note")
          .addEventListener("touchmove", () => repeafunc(), false);
        document
          .getElementById("note")
          .addEventListener("touchend", () => repeafunc(), false);
        document
          .getElementById("note")
          .addEventListener("touchcancel", () => repeafunc(), false);
        document
          .getElementById("note")
          .addEventListener("touchleave", () => repeafunc(), false);
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
          if (document.getElementById("lock").innerHTML == "&#xE785;") {
            document.getElementById("redo").style.display = "block";
            document.getElementById("titlebar").style.height = "32px";
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
          if (document.getElementById("lock").innerHTML == "&#xE785;") {
            document.getElementById("redo").style.display = "block";
            document.getElementById("titlebar").style.height = "32px";
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
          if (document.getElementById("lock").innerHTML == "&#xE785;") {
            document.getElementById("redo").style.display = "none";
            document.getElementById("titlebar").style.height = "0";
            document.getElementById("color").style.height = "0";
            document.getElementById("lock").style.display = "none";
            document.getElementById("add").style.display = "none";
            document.getElementById("more").style.display = "none";
            document.getElementById("minimize").style.display = "none";
            document.getElementById("close").style.display = "none";
            document.getElementById("menu").style.display = "none";
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
