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

<template>
  <div>
    <div id="selectmedia">
      <span id="songselect" title="Select Audio" v-on:click="clicksong">&#xEC4F;</span>
      <span id="videoselect" title="Select Video" v-on:click="clickvideo">&#xE714;</span>
    </div>
    <div id="lightYellow">
      <!--<div id="editor" data-meteor-emoji="true"></div>-->
      <div id="editor"></div>
    </div>
  </div>
</template>

<script>
import { remote } from "electron";
import Quill from "quill";
import store from "store";
import swal from "sweetalert";
import $ from "./../../assets/script/jquery.js";
import wordsarray from "an-array-of-english-words";
export default {
  mounted() {
    let words = wordsarray.filter(word => word.match(/^/i));
    var BackgroundClass = Quill.import("attributors/class/background");
    var ColorClass = Quill.import("attributors/class/color");
    var SizeStyle = Quill.import("attributors/style/size");
    SizeStyle.whitelist = ["10px", "18px", "27px", "37px"];
    Quill.register(BackgroundClass, true);
    Quill.register(ColorClass, true);
    Quill.register(SizeStyle, true);
    var Font = Quill.import("formats/font");
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
          document.querySelector(".ql-toolbar").style.backgroundColor = color1;
          remote.getCurrentWindow().on("close", e => {
            e.preventDefault();
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
              remote.getCurrentWindow().destroy();
            }, 730);
          });
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
      quill.on("text-change", function() {
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
          search: function(term, callback) {
            callback(
              $.map(words, function(word) {
                return word.indexOf(term) === 0 ? word : null;
              })
            );
          },
          replace: function(word) {
            return word + " ";
          }
        }
      ]);
    }, 1000);
  },
  methods: {
    clicksong: function() {
      remote.dialog.showOpenDialog(
        {
          filters: [
            {
              name: "Audo Files",
              extensions: ["mp3", "MP3", "wav", "WAV", "ogg", "OGG"]
            }
          ]
        },
        audios => {
          if (audios === undefined) return;
          var audiofile = audios[0];
          document.querySelector(
            ".ql-snow .ql-editor"
          ).innerHTML += `<iframe id="audio" srcdoc="<audio src='file:///${audiofile}' controls></audio>"></iframe>`;
        }
      );
    },
    clickvideo: function() {
      remote.dialog.showOpenDialog(
        {
          filters: [
            {
              name: "Video Files",
              extensions: [
                "mp4",
                "MP4",
                "webm",
                "WEBM",
                "WebM",
                "ogg",
                "OGG",
                "Ogg"
              ]
            }
          ]
        },
        videos => {
          if (videos === undefined) return;
          var videofile = videos[0];
          document.querySelector(
            ".ql-snow .ql-editor"
          ).innerHTML += `<iframe srcdoc="<video src='file:///${videofile}' height='150px' controls preload='none'></video>" id="video"></iframe>`;
        }
      );
    }
  }
};
</script>
