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
    <div id="lightYellow">
      <div id="editor"></div>
    </div>
    <canvas id="draw" style="position:absolute;left:0;right:0;top:40px;bottom:60px;z-index:100;"></canvas>
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

// Vue Class
export default {
  // Do On Start
  mounted() {
    // Cavas
    let htmlCanvas = document.getElementById("draw");
    window.addEventListener("resize", resizeCanvas, false);
    resizeCanvas();
    function resizeCanvas() {
      htmlCanvas.width = window.innerWidth;
      htmlCanvas.height = window.innerHeight - 100;
    }
    var arr_touches = [];
    var arr_touches = [];
    var canvas;
    var ctx;
    var down = false;
    var color = "black";
    var width = 5;
    canvas = document.getElementById("draw");
    ctx = canvas.getContext("2d");
    ctx.lineWidth = width;
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mousedown", handleDown);
    canvas.addEventListener("mouseup", handleUp);
    canvas.addEventListener("touchstart", handleStart, false);
    canvas.addEventListener("touchend", handleEnd, false);
    canvas.addEventListener("touchcancel", handleCancel, false);
    canvas.addEventListener("touchleave", handleEnd, false);
    canvas.addEventListener("touchmove", handleTouchMove, false);
    canvas.addEventListener("painterWidth", changeWidth, false);
    function changeSize(sizeDirection) {
      if (sizeDirection === "-") {
        if (width >= 2) width = width - 1;
      } else if (sizeDirection === "+") {
        if (width <= 100) width = width + 1;
      }
      window.onload();
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
    function handleDown() {
      down = true;
      ctx.beginPath();
      ctx.moveTo(xPos, yPos);
    }
    function handleUp() {
      down = false;
    }
    function handleStart(evt) {
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        if (isValidTouch(touches[i])) {
          evt.preventDefault();
          arr_touches.push(copyTouch(touches[i]));
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
    }
    function handleTouchMove(evt) {
      var touches = evt.changedTouches;
      var offset = findPos(canvas);
      for (var i = 0; i < touches.length; i++) {
        if (isValidTouch(touches[i])) {
          evt.preventDefault();
          var idx = ongoingTouchIndexById(touches[i].identifier);
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
    function handleEnd(evt) {
      var touches = evt.changedTouches;
      var offset = findPos(canvas);
      for (var i = 0; i < touches.length; i++) {
        if (isValidTouch(touches[i])) {
          evt.preventDefault();
          var idx = ongoingTouchIndexById(touches[i].identifier);
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
    }
    function handleCancel(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;

      for (var i = 0; i < touches.length; i++) {
        arr_touches.splice(i, 1);
      }
    }
    function copyTouch(touch) {
      return {
        identifier: touch.identifier,
        clientX: touch.clientX,
        clientY: touch.clientY
      };
    }
    function ongoingTouchIndexById(idToFind) {
      for (var i = 0; i < arr_touches.length; i++) {
        var id = arr_touches[i].identifier;
        if (id == idToFind) {
          return i;
        }
      }
      return -1;
    }
    function changeColor(new_color) {
      color = new_color;
    }
    function changeWidth(painterWidth) {
      width = painterWidth;
    }
    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    function isValidTouch(touch) {
      var curleft = 0,
        curtop = 0;
      var offset = 0;
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
    function findPos(obj) {
      var curleft = 0,
        curtop = 0;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj == obj.offsetParent);

        return {
          x: curleft - document.body.scrollLeft,
          y: curtop - document.body.scrollTop
        };
      }
    }
    function newColor() {
      elColor = document.getElementById("color");
      cv = document.getElementById("colorValue");
      cv.innerHTML = "color: " + elColor.value;
      color = elColor.value;
    }
    function c(val) {
      document.getElementById("d").value = val;
    }
    function v(val) {
      document.getElementById("d").value += val;
    }
    function e() {
      try {
        c(eval(document.getElementById("d").value));
      } catch (e) {
        c("Error");
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
    }, 100);
    window.setTimeout(() => {
      words = words.concat(cap, upp);
    }, 200);

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
        ]
      },
      placeholder: "Add Your Note",
      theme: "snow"
    });

    let func = obj => {
      let repeafunc = () => {
        if (
          document.querySelector(".ql-snow .ql-editor").innerHTML !=
          "<p><br></p>"
        ) {
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
          window.onbeforeunload = e => {
            e.returnValue = true;
            if (store.get(obj.toString()).deleted == "no") {
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
            }
            window.setTimeout(() => {
              if (
                store.get(obj.toString()).closed == "yes" ||
                store.get(obj.toString()).deleted == "yes"
              ) {
                remote.getCurrentWindow().destroy();
              }
            }, 300);
          };
          try {
            window.setInterval(() => {
              if (store.get(obj.toString()).deleted == "yes") {
                store.remove(obj.toString());
                if (store.get(obj.toString()) == undefined) {
                  remote.getCurrentWindow().close();
                }
              }
            }, 1);
          } catch {}
        }
      };
      quill.on("text-change", () => {
        repeafunc();
      });
      document.getElementById("color").addEventListener("click", () => {
        repeafunc();
      });
      document.getElementById("cc").addEventListener("click", () => {
        repeafunc();
      });
      document.getElementById("locks").addEventListener("click", () => {
        repeafunc();
      });
      window.addEventListener("resize", () => {
        repeafunc();
      });
      if (
        document.querySelector(".ql-snow .ql-editor").innerHTML != "<p><br></p>"
      ) {
        repeafunc();
      }
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
    }, 1000);
  }
};
</script>
