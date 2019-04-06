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
    <div id="backc"></div>
    <div id="candit">
      <select id="brushcolor">
        <option id="black" value="black">Black</option>
        <option id="red" value="red">Red</option>
        <option id="green1" value="green">Green</option>
        <option id="blue1" value="blue">Blue</option>
        <option id="white" value="white">White</option>
      </select>
      <select id="brushwidth">
        <option value="1">Very Small</option>
        <option value="3">Small</option>
        <option value="5" selected="selected">Normal</option>
        <option value="10">Big</option>
        <option value="20">Very Big</option>
        <option value="40">extremely big</option>
      </select>
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

// Vue Class
export default {
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
    ctx.lineWidth = width;
    window.setInterval(() => {
      let color1 = window
        .getComputedStyle(document.getElementById("lightYellow"))
        .getPropertyValue("background-color");
      document.getElementById("backc").style.backgroundColor = color1;
    }, 1);
    document.getElementById("brushcolor").addEventListener("change", () => {
      color = document.getElementById("brushcolor").value;
    });
    document.getElementById("brushwidth").addEventListener("change", () => {
      changeWidth(Number(document.getElementById("brushwidth").value));
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
    function handleMove(e) {
      let xPos = e.clientX - canvas.offsetLeft;
      let yPos = e.clientY - canvas.offsetTop;
      if (down == true) {
        ctx.lineTo(xPos, yPos);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
      }
      drawPoints(ctx, arr_touches);
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
      drawPoints(ctx, arr_touches);
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
    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    function drawPoints(ctx, arr_touches) {
      if (points.length < 6) {
        var b = points[0];
        ctx.beginPath(),
          ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0),
          ctx.closePath(),
          ctx.fill();
        return;
      }
      ctx.beginPath(), ctx.moveTo(points[0].x, points[0].y);
      for (i = 1; i < points.length - 2; i++) {
        var c = (points[i].x + points[i + 1].x) / 2,
          d = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
      }
      ctx.quadraticCurveTo(
        points[i].x,
        points[i].y,
        points[i + 1].x,
        points[i + 1].y
      ),
        ctx.stroke();
    }
    // function newColor() {
    //   elColor = document.getElementById("color");
    //   cv = document.getElementById("colorValue");
    //   cv.innerHTML = "color: " + elColor.value;
    //   color = elColor.value;
    // }

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
  },
  methods: {
    clearCanvas() {
      document
        .getElementById("draw")
        .getContext("2d")
        .clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
};
</script>
