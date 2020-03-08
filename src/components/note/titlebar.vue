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

<!-- Title Bar Section Of Note Page-->
<!-- Html -->
<template>
  <div>
    <div id="titlebar" style="position:fixed;">
      <div id="drag-region">
        <div class="id" id="window-title1" title="Add Note" v-on:click="note">
          <span id="add">&#xE710;</span>
        </div>
        <div id="locks" title="Lock Note" v-on:click="locks">
          <span id="lock">&#xE785;</span>
        </div>
        <div id="window-controls1">
          <div class="button" id="menus" title="Menu">
            <span id="menu" v-on:click="menu">&#xE712;</span>
            <div id="menu-content" class="dropdown-content">
              <a title="Select Image" id="image1" v-on:click="clickimage">
                <span>&#xEB9F;</span>Add Image
              </a>
              <a title="Select Audio" id="video1" v-on:click="clickvideo">
                <span>&#xE714;</span>Add Video
              </a>
              <a title="Select Video" id="audio1" v-on:click="clicksong">
                <span>&#xE8D6;</span>Add Audio
              </a>
              <a id="import" title="Import Note">
                <span>&#xE8B5;</span>Import
              </a>
              <a v-on:click="exportnote" id="export" title="Export Note">
                <span>&#xEDE1;</span>Export
              </a>
            </div>
          </div>
          <div class="button" id="show" title="Edit Text" v-on:click="showedit">
            <span id="more" class="more">&#xE70F;</span>
          </div>
          <div class="button" id="minimize-button" v-on:click="minimize">
            <span id="minimize">&#xE738;</span>
          </div>
          <div class="button" id="close-button" v-on:click="close">
            <span id="close">&#xE8BB;</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Javascript -->
<script>
import { ipcRenderer } from "electron";
// Vue Class
export default {
  // Props
  props: {
    close: Function,
    note: Function,
    minimize: Function
  },

  mounted() {
    document.addEventListener("keydown", k => {
      if (k.key == "l" && k.ctrlKey) {
        this.locks();
      }
    });
    document.addEventListener("keydown", k => {
      if (k.key == "s" && k.ctrlKey) {
        this.exportnote();
      }
    });
    if (document.getElementById("lightYellow")) {
      document.addEventListener("drop", e => {
        if (document.getElementById("draw") != "block") {
          let files = e.dataTransfer.files;
          let images = [
            "apng",
            "bmp",
            "ico",
            "cur",
            "jpg",
            "jpeg",
            "jfif",
            "pjpeg",
            "pjp",
            "png",
            "svg",
            "webp"
          ];
          let audios = ["mp3", "MP3", "wav", "WAV", "ogg", "OGG"];
          let videos = [
            "mp4",
            "MP4",
            "webm",
            "WEBM",
            "WebM",
            "ogg",
            "OGG",
            "Ogg"
          ];
          for (let file of files) {
            images.forEach(image => {
              if (new RegExp("." + image).test(file.path)) {
                this.image(file.path);
              }
            });
            videos.forEach(video => {
              if (new RegExp("." + video).test(file.path)) {
                this.video(file.path);
              }
            });
            audios.forEach(audio => {
              if (new RegExp("." + audio).test(file.path)) {
                this.audio(file.path);
              }
            });
          }
        }
      });
    } else {
      document.getElementById("image1").style.display = "none";
      document.getElementById("video1").style.display = "none";
      document.getElementById("audio1").style.display = "none";
    }
  },

  // Functions
  methods: {
    // Locking Note Function
    locks() {
      let id = document.getElementById("lock");
      let select = document.getElementById("close-button");
      let select0 = document.getElementById("show");
      let select1 = document.getElementById("color");
      let select2 = document.getElementById("editor");
      let select3 = document.querySelector(".ql-snow.ql-toolbar");
      let select4 = document.getElementById("window-title1");
      let select5 = document.getElementById("menus");
      let select6 = document.getElementById("draw");
      let select7 = document.getElementById("candit");
      let select8 = document.querySelector(".upper-canvas");
      if (
        select.style.pointerEvents == "auto" ||
        select.style.pointerEvents == ""
      ) {
        let { ipcRenderer } = require("electron");
        id.innerHTML = "&#xE72E;";
        select.style.pointerEvents = "none";
        select0.style.pointerEvents = "none";
        select1.style.pointerEvents = "none";
        if (document.querySelector(".ql-snow.ql-toolbar")) {
          select2.style.pointerEvents = "none";
          select3.style.display = "none";
        }
        select4.style.display = "none";
        select5.style.pointerEvents = "none";
        if (document.getElementById("candit")) {
          select6.style.pointerEvents = "none";
          select7.style.display = "none";
          select8.style.pointerEvents = "none";
        }
        let clearint = window.setInterval(() => {
          document.getElementById("color").style.height = "0";
          document.getElementById("locks").style.marginLeft = "-35px";
          document.getElementById("add").style.display = "none";
          document.getElementById("more").style.display = "none";
          document.getElementById("minimize").style.display = "none";
          document.getElementById("close").style.display = "none";
          document.getElementById("menu").style.display = "none";
          document.getElementById("redo").style.display = "none";
          if (document.getElementById("lightYellow")) {
            document.getElementById("lightYellow").style.paddingTop = "30px";
          }
          document.getElementById("undo").style.display = "none";
          document.getElementById("deletenote1").style.display = "none";
          if (
            document.getElementById("menu-content").classList.contains("show")
          ) {
            document.getElementById("menu-content").classList.remove("show");
          }

          ipcRenderer.invoke("setMaximumSize", 300, 325);
          if (select.style.pointerEvents == "auto") {
            document.getElementById("color").style.height = "40px";
            document.getElementById("locks").style.marginLeft = "0";
            document.getElementById("add").style.display = "flex";
            document.getElementById("more").style.display = "flex";
            document.getElementById("minimize").style.display = "flex";
            document.getElementById("close").style.display = "flex";
            document.getElementById("menu").style.display = "flex";
            document.getElementById("redo").style.display = "block";
            document.getElementById("undo").style.display = "block";
            document.getElementById("deletenote1").style.display = "block";
            ipcRenderer.invoke("setMaximumSize", 100000, 100000);
            clearInterval(clearint);
          }
        }, 0.001);
        clearint;
      } else {
        select.style.pointerEvents = "auto";
        id.innerHTML = "&#xE785;";
        select0.style.pointerEvents = "auto";
        select1.style.pointerEvents = "auto";
        if (document.querySelector(".ql-snow.ql-toolbar")) {
          select2.style.pointerEvents = "auto";
        }
        select4.style.display = "flex";
        select5.style.pointerEvents = "auto";
        if (document.getElementById("candit")) {
          select6.style.pointerEvents = "auto";
          select8.style.pointerEvents = "auto";
        }
      }
    },

    // Edinting Option Show And Hide Function
    showedit() {
      let select0 = document.getElementById("color");
      if (document.querySelector(".ql-snow.ql-toolbar")) {
        let select = document.querySelector(".ql-snow.ql-toolbar");
        if (select.style.display == "none" || select.style.display == "") {
          select.style.display = "block";
          select0.style.height = "0";
          document.getElementById("lightYellow").style.paddingTop = "90px";
        } else {
          select.style.display = "none";
          select0.style.height = "40px";
          document.getElementById("lightYellow").style.paddingTop = "30px";
        }
      } else {
        let select1 = document.getElementById("candit");
        if (select1.style.display == "none" || select1.style.display == "") {
          select1.style.display = "block";
        } else {
          select1.style.display = "none";
        }
        select0.style.height = "40px";
      }
    },

    //Menu Show And Hide Function
    menu() {
      document.getElementById("menu-content").classList.toggle("show");
    },

    // Exportb Note Function
    async exportnote() {
      let { ipcRenderer } = require("electron");
      let note = await ipcRenderer.invoke("exportnote");
      if (note) {
        let data;
        let color;
        if (document.querySelector(".ql-snow .ql-editor")) {
          data = document.querySelector(".ql-snow .ql-editor").innerHTML;
          color = window
            .getComputedStyle(document.getElementById("lightYellow"))
            .getPropertyValue("background-color");
        } else {
          data = document.querySelector(".lower-canvas").toDataURL();
          color = window
            .getComputedStyle(document.getElementById("backc"))
            .getPropertyValue("background-color");
        }
        let fs = require("fs");
        fs.writeFile(
          note,
          data +
            "\n" +
            color +
            "\n" +
            window
              .getComputedStyle(document.getElementById("titlebar"))
              .getPropertyValue("background-color") +
            "\n" +
            window.innerWidth.toString() +
            "\n" +
            window.innerHeight.toString(),
          e => {
            if (e) {
              let swal = require("sweetalert");

              swal("Not Supported");
            }
          }
        );
      }
    },

    // Add image To Note
    image(img) {
      try {
        document.querySelector(
          ".ql-snow .ql-editor"
        ).innerHTML += `<img src="file:///${img}" style="max-width: 100%;height: auto;">`;
      } catch {
        let swal = require("sweetalert");
        swal("Not Supported");
      }
    },

    async clickimage() {
      let { ipcRenderer } = require("electron");
      let images = await ipcRenderer.invoke("image");
      images.filePaths.forEach(image => {
        this.image(image);
      });
    },

    // Add Audio To Note
    audio(audio) {
      try {
        document.querySelector(
          ".ql-snow .ql-editor"
        ).innerHTML += `<iframe id="audio" srcdoc="<audio src='file:///${audio}' controls></audio>"></iframe>`;
      } catch {
        let swal = require("sweetalert");

        swal("Not Supported");
      }
    },

    async clicksong() {
      let { ipcRenderer } = require("electron");
      let audios = await ipcRenderer.invoke("audio");
      audios.filePaths.forEach(audio => {
        this.audio(audio);
      });
    },

    // Add Video To Note
    video(video) {
      try {
        document.querySelector(
          ".ql-snow .ql-editor"
        ).innerHTML += `<iframe srcdoc="<video src='file:///${video}' style='width:100%;height:auto;' controls preload='none'></video>" id="video"></iframe>`;
      } catch {
        let swal = require("sweetalert");

        swal("Not Supported");
      }
    },

    async clickvideo() {
      let { ipcRenderer } = require("electron");
      let videos = await ipcRenderer.invoke("video");
      videos.filePaths.forEach(video => {
        this.video(video);
      });
    }
  }
};
</script>
