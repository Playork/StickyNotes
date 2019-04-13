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

<!-- Editor Section Of Note Page-->
<!-- Html -->
<template>
  <div>
    <span title="Add Emoji" id="emoji" v-on:click="emoji">&#xE76E;</span>
    <span title="close" id="hideemoji" v-on:click="hideemoji">&#xE8BB;</span>
    <div id="emojip">
      <picker
        set="google"
        @select="addEmoji"
        title="Pick your emoji…"
        emoji="point_up"
        :style="{ position: 'absolute', top: '40px',right: '0', zIndex: '7', width: '275px', height:'335px'}"
        :i18n="{ search: 'Search', categories: { search: 'Results Of Your Search', recent: 'Recent' } }"
      />
    </div>
    <div id="lightYellow">
      <div id="editor"></div>
    </div>
    <div id="backc"></div>
    <section id="choosepaint">
      Color:
      <input type="color" value="#000000" id="color3">
      <br>
      <button class="button1" v-on:click="cancel">Cancel</button>
      <button id="cc" class="button1">done</button>
    </section>
    <div id="candit">
      <div id="brushcolor">
        <button id="black" class="buttons">
          <span id="c1" class="selected select">&#xE73E;</span>
        </button>
        <button id="red" class="buttons">
          <span id="c2" class="selected hide">&#xE73E;</span>
        </button>
        <button id="green1" class="buttons">
          <span id="c3" class="selected hide">&#xE73E;</span>
        </button>
        <button id="blue1" class="buttons">
          <span id="c4" class="selected hide">&#xE73E;</span>
        </button>
        <button id="white" class="buttons">
          <span id="c5" class="selected hide">&#xE73E;</span>
        </button>
        <button id="paintcolor" class="buttons" v-on:click="showthis" title="Choose Color">
          <span>&#xE710;</span>
        </button>
      </div>
      <input type="range" min="1" max="50" value="5" id="brushwidth">
      <p id="widthvalue">5</p>
      <button id="clear" v-on:click="clearCanvas">&#xE74D;</button>
    </div>
    <canvas id="draw"></canvas>
  </div>
</template>

<!-- Javascript -->
<script>
// Import Required Packages
import { remote } from "electron";
import Quill from "quill";
import katex from "katex";
import store from "store";
import swal from "sweetalert";
import $ from "./../../assets/script/jquery.js";
import wordsarray from "an-array-of-english-words";
import { setTimeout, setInterval } from "timers";
import { Picker } from "emoji-mart-vue";

// Vue Class
export default {
  // Components
  components: {
    Picker
  },

  // Vars
  data() {
    return {
      id: ["black", "red", "green1", "blue1", "white"],
      select: ["c1", "c2", "c3", "c4", "c5"],
      color3: ["black", "red", "green", "blue", "white"]
    };
  },

  // Do On Start
  mounted() {
    // Cavas
    let canvas = document.getElementById("draw");
    window.addEventListener("resize", resizeCanvas, false);
    resizeCanvas();
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    let arr_touches = [];
    let down = false;
    let color = "black";
    let width = 5;
    let ctx = canvas.getContext("2d");
    let cPushArray = new Array();
    let cStep = -1;
    ctx.lineWidth = width;
    window.setInterval(() => {
      let color1 = window
        .getComputedStyle(document.getElementById("lightYellow"))
        .getPropertyValue("background-color");
      document.getElementById("backc").style.backgroundColor = color1;
    }, 1);
    document.getElementById("brushcolor").addEventListener("click", () => {
      for (let i = 0; i < 5; i++) {
        document.getElementById(this.id[i]).onclick = () => {
          color = this.color3[i];
          for (let j = 0; j < 5; j++) {
            document.getElementById(this.select[j]).classList.remove("select");
            document.getElementById(this.select[j]).classList.add("hide");
          }
          document.getElementById(this.select[i]).classList.add("select");
          document.getElementById(this.select[i]).classList.remove("hide");
        };
      }
    });
    document.getElementById("cc").addEventListener("click", () => {
      let Color = document.getElementById("color3").value;
      color = Color;
      document.querySelector("section").style.display = "none";
      for (let j = 0; j < 7; j++) {
        document.getElementById(this.select[j]).classList.remove("select");
        document.getElementById(this.select[j]).classList.add("hide");
      }
    });
    document.getElementById("brushwidth").addEventListener("change", () => {
      width = document.getElementById("brushwidth").value;
      document.getElementById("widthvalue").innerHTML = document.getElementById(
        "brushwidth"
      ).value;
    });
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mousedown", handleDown);
    canvas.addEventListener("mouseup", handleUp);
    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
    canvas.addEventListener("touchleave", handleEnd, false);
    canvas.addEventListener("touchmove", handleTouchMove, false);
    canvas.addEventListener("painterWidth", changeWidth, false);
    function cPush() {
      cStep++;
      if (cStep < cPushArray.length) {
        cPushArray.length = cStep;
      }
      cPushArray.push(document.getElementById("draw").toDataURL());
    }
    function handleMove(e) {
      let xPos = e.clientX - canvas.offsetLeft;
      let yPos = e.clientY - canvas.offsetTop;
      if (down == true) {
        ctx.lineTo(xPos, yPos);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
      }
    }
    function handleDown(e) {
      let xPos = e.clientX - canvas.offsetLeft;
      let yPos = e.clientY - canvas.offsetTop;
      down = true;
      ctx.beginPath();
      ctx.moveTo(xPos, yPos);
    }
    function handleUp() {
      down = false;
      cPush();
    }
    function handleStart(e) {
      let touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        if (isValidTouch(touches[i])) {
          e.preventDefault();
          arr_touches.push(copyTouch(touches[i]));
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
    }
    function handleTouchMove(e) {
      let touches = e.changedTouches;
      let offset = findPos(canvas);
      for (let i = 0; i < touches.length; i++) {
        if (isValidTouch(touches[i])) {
          e.preventDefault();
          let idx = ongoingTouchIndexById(touches[i].identifier);
          if (idx >= 0) {
            ctx.beginPath();
            ctx.moveTo(
              arr_touches[idx].clientX - offset.x,
              arr_touches[idx].clientY - offset.y
            );
            ctx.lineTo(
              touches[i].clientX - offset.x,
              touches[i].clientY - offset.y
            );
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            ctx.stroke();

            arr_touches.splice(idx, 1, copyTouch(touches[i]));
          }
        }
      }
    }
    function handleEnd(e) {
      let touches = e.changedTouches;
      let offset = findPos(canvas);
      for (let i = 0; i < touches.length; i++) {
        if (isValidTouch(touches[i])) {
          e.preventDefault();
          let idx = ongoingTouchIndexById(touches[i].identifier);
          if (idx >= 0) {
            ctx.lineWidth = 4;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(
              arr_touches[idx].clientX - offset.x,
              arr_touches[idx].clientY - offset.y
            );
            ctx.lineTo(
              touches[i].clientX - offset.x,
              touches[i].clientY - offset.y
            );
            arr_touches.splice(i, 1);
          }
        }
      }
      cPush();
    }
    function handleCancel(e) {
      e.preventDefault();
      let touches = e.changedTouches;

      for (let i = 0; i < touches.length; i++) {
        arr_touches.splice(i, 1);
      }
    }
    function copyTouch(e) {
      return {
        identifier: e.identifier,
        clientX: e.clientX,
        clientY: e.clientY
      };
    }
    function ongoingTouchIndexById(e) {
      for (let i = 0; i < arr_touches.length; i++) {
        let id = arr_touches[i].identifier;
        if (id == e) {
          return i;
        }
      }
      return -1;
    }
    function changeWidth(e) {
      width = e;
    }
    function isValidTouch(touch) {
      let curleft = 0,
        curtop = 0;
      let offset = 0;
      if (canvas.offsetParent) {
        do {
          curleft += canvas.offsetLeft;
          curtop += canvas.offsetTop;
        } while (touch == canvas.offsetParent);

        offset = {
          x: curleft - document.body.scrollLeft,
          y: curtop - document.body.scrollTop
        };
      }
      if (
        touch.clientX - offset.x > 0 &&
        touch.clientX - offset.x < parseFloat(canvas.width) &&
        touch.clientY - offset.y > 0 &&
        touch.clientY - offset.y < parseFloat(canvas.height)
      ) {
        return true;
      } else {
        return false;
      }
    }
    function findPos(e) {
      let curleft = 0,
        curtop = 0;
      if (e.offsetParent) {
        do {
          curleft += e.offsetLeft;
          curtop += e.offsetTop;
        } while (e == e.offsetParent);

        return {
          x: curleft - document.body.scrollLeft,
          y: curtop - document.body.scrollTop
        };
      }
    }

    // matching Toolbar Color To Note
    window.setInterval(() => {
      document.querySelector(
        ".ql-toolbar"
      ).style.backgroundColor = window
        .getComputedStyle(document.getElementById("lightYellow"))
        .getPropertyValue("background-color");
    }, 1);

    // Create Text Suggestion Words Array
    let words = wordsarray.filter(word => word.match(/^/i));
    let cap = [];
    let upp = [];
    window.setTimeout(() => {
      for (let i = 0; i < words.length; i++) {
        cap[i] = words[i].charAt(0).toUpperCase() + words[i].substr(1);
      }
      for (let i = 0; i < words.length; i++) {
        upp[i] = words[i].toUpperCase();
      }
    }, 50);
    window.setTimeout(() => {
      words = words.concat(cap, upp);
    }, 50);

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
        let url = document.getElementById("draw").toDataURL();
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
        if (document.getElementById("lightYellow").style.display != "none") {
          if (
            document.querySelector(".ql-snow .ql-editor").innerHTML !=
            "<p><br></p>"
          ) {
            store.set(obj.toString(), {
              first: text,
              back: color1,
              title: color2,
              wid: winwidth,
              hei: winheight,
              deleted: "no",
              closed: "no",
              locked: lock
            });
          }
        } else {
          store.set(obj.toString(), {
            image: url,
            back: color1,
            title: color2,
            wid: winwidth,
            hei: winheight,
            deleted: "no",
            closed: "no",
            locked: lock
          });
        }
        window.onbeforeunload = e => {
          e.returnValue = true;
          if (
            store.get(obj.toString()) == undefined ||
            store.get(obj.toString()).deleted == "no"
          ) {
            if (
              document.getElementById("lightYellow").style.display != "none"
            ) {
              if (
                document.querySelector(".ql-snow .ql-editor").innerHTML !=
                "<p><br></p>"
              ) {
                store.set(obj.toString(), {
                  first: text,
                  back: color1,
                  title: color2,
                  wid: winwidth,
                  hei: winheight,
                  deleted: "no",
                  closed: "yes",
                  locked: lock
                });
              } else {
                store.remove(obj.toString());
                remote.getCurrentWindow().destroy();
              }
            } else {
              store.set(obj.toString(), {
                image: url,
                back: color1,
                title: color2,
                wid: winwidth,
                hei: winheight,
                deleted: "no",
                closed: "yes",
                locked: lock
              });
            }
          }
          window.setTimeout(() => {
            if (
              store.get(obj.toString()).closed == "yes" ||
              store.get(obj.toString()).deleted == "yes"
            ) {
              remote.getCurrentWindow().destroy();
            }
          }, 50);
        };

        window.setInterval(() => {
          try {
            if (store.get(obj.toString()).deleted == "yes") {
              store.remove(obj.toString());
              if (store.get(obj.toString()) == undefined) {
                remote.getCurrentWindow().destroy();
              }
            }
          } catch {}
        }, 1);
      };
      quill.on("text-change", () => repeafunc());
      canvas = document.getElementById("draw");
      canvas.addEventListener("mousemove", () => repeafunc());
      canvas.addEventListener("mousedown", () => repeafunc());
      canvas.addEventListener("mouseup", () => repeafunc());
      canvas.addEventListener("touchstart", () => repeafunc(), false);
      canvas.addEventListener("touchend", () => repeafunc(), false);
      canvas.addEventListener("touchcancel", () => repeafunc(), false);
      canvas.addEventListener("touchleave", () => repeafunc(), false);
      canvas.addEventListener("touchmove", () => repeafunc(), false);
      document
        .getElementById("color")
        .addEventListener("click", () => repeafunc());
      document
        .getElementById("cc")
        .addEventListener("click", () => repeafunc());
      document
        .getElementById("locks")
        .addEventListener("click", () => repeafunc());
      window.addEventListener("resize", () => repeafunc());
    };
    try {
      let id = Number(store.get("id").ids);
      func(id);
    } catch {
      let id = 1;
      func(id);
    }
    window.setTimeout(() => {
      $(".ql-snow .ql-editor").textcomplete([
        {
          match: /(^|\b)(\w{2,})$/,
          search: (term, callback) => {
            callback(
              $.map(words, word => {
                return word.indexOf(term) === 0 ? word : null;
              })
            );
          },
          replace: word => {
            return word + " ";
          }
        }
      ]);
    }, 500);
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
    },

    // Clear Canvas
    clearCanvas() {
      document
        .getElementById("draw")
        .getContext("2d")
        .clearRect(0, 0, window.innerWidth, window.innerHeight);
    },

    // Custom Color Choser Show Hide Function
    showthis() {
      document.getElementById("paintcolor").onclick = () => {
        document.getElementById("choosepaint").style.display = "block";
      };
    },

    // Cancel Color Selection
    cancel() {
      document.querySelector("section").style.display = "none";
    }
  }
};
</script>
