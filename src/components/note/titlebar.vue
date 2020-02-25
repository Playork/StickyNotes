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
              <a title="Undo" id="undo"> <span>&#xE7A7;</span>Undo </a>
              <a title="Redo" id="redo"> <span>&#xE7A6;</span>Redo </a>
              <a title="Select Image" id="image1" v-on:click="clickimage">
                <span>&#xE714;</span>Add Image
              </a>
              <a title="Select Audio" id="video1" v-on:click="clickvideo">
                <span>&#xE714;</span>Add Video
              </a>
              <a title="Select Video" id="audio1" v-on:click="clicksong">
                <span>&#xE8D6;</span>Add Audio
              </a>
              <a v-on:click="importnote" id="import" title="Import Note">
                <span>&#xE8B5;</span>Import
              </a>
              <a v-on:click="exportnote" id="export" title="Export Note">
                <span>&#xEDE1;</span>Export
              </a>
              <a id="deletenote" title="Delete Note">
                <span>&#xE74D;</span>Delete
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
// Vue Class
export default {
  // Props
  props: {
    close: Function,
    note: Function,
    minimize: Function
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
      if (
        select.style.pointerEvents == "auto" ||
        select.style.pointerEvents == ""
      ) {
        let { ipcRenderer } = require("electron");
        id.innerHTML = "&#xE72E;";
        select.style.pointerEvents = "none";
        select0.style.pointerEvents = "none";
        select1.style.pointerEvents = "none";
        select2.style.pointerEvents = "none";
        select3.style.display = "none";
        select4.style.display = "none";
        select5.style.pointerEvents = "none";
        let clearint = window.setInterval(() => {
          document.getElementById("color").style.height = "0";
          document.getElementById("locks").style.marginLeft = "-35px";
          document.getElementById("add").style.display = "none";
          document.getElementById("more").style.display = "none";
          document.getElementById("minimize").style.display = "none";
          document.getElementById("close").style.display = "none";
          document.getElementById("menu").style.display = "none";
          document.getElementById("lightYellow").style.paddingTop = "30px";
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
            ipcRenderer.invoke("setMaximumSize", 100000, 100000);
            clearInterval(clearint);
          }
        }, 0.001);
        clearint;
      } else {
        id.innerHTML = "&#xE785;";
        select.style.pointerEvents = "auto";
        select0.style.pointerEvents = "auto";
        select1.style.pointerEvents = "auto";
        select2.style.pointerEvents = "auto";
        select4.style.display = "flex";
        select5.style.pointerEvents = "auto";
      }
    },

    // Edinting Option Show And Hide Function
    showedit() {
      let select = document.querySelector(".ql-snow.ql-toolbar");
      let select0 = document.getElementById("color");
      if (select.style.display == "none" || select.style.display == "") {
        select.style.display = "block";
        select0.style.height = "0";
        document.getElementById("lightYellow").style.paddingTop = "90px";
      } else {
        select.style.display = "none";
        select0.style.height = "40px";
        document.getElementById("lightYellow").style.paddingTop = "30px";
      }
    },

    //Menu Show And Hide Function
    menu() {
      document.getElementById("menu-content").classList.toggle("show");
    },

    // Import Note Function
    async importnote() {
      let { ipcRenderer } = require("electron");
      let notes = await ipcRenderer.invoke("importnote");
      if (note.filePaths[0] != undefined) {
        let fs = require("fs");
        fs.readFile(note.filePaths[0], (e, d) => {
          if (e) {
            let swal = require("sweetalert");

            swal("Not Supported");
          } else {
            d = d.toString().split("\n");
            document.querySelector(".ql-snow .ql-editor").innerHTML = d[0];
            window.resizeTo(Number(d[3]), Number([4]));
            document.getElementById("lightYellow").style.backgroundColor = d[1];
            document.getElementById("titlebar").style.backgroundColor = d[2];
          }
        });
      }
    },

    // Exportb Note Function
    async exportnote() {
      let { ipcRenderer } = require("electron");
      let notes = await ipcRenderer.invoke("exportnote");
      if (note.filePath != undefined) {
        let data = document.querySelector(".ql-snow .ql-editor").innerHTML;
        let fs = require("fs");
        fs.writeFile(
          note.filePath,
          data +
            "\n" +
            window
              .getComputedStyle(document.getElementById("lightYellow"))
              .getPropertyValue("background-color") +
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
    async clickimage() {
      let { ipcRenderer } = require("electron");
      let images = await ipcRenderer.invoke("image");
      if (images.filePaths[0]) {
        try {
          document.querySelector(
            ".ql-snow .ql-editor"
          ).innerHTML += `<img src="file:///${images.filePaths[0]}" style="width: 100%;height: auto;">`;
        } catch {
          let swal = require("sweetalert");
          swal("Not Supported");
        }
      }
    },

    // Add Audio To Note
    async clicksong() {
      let { ipcRenderer } = require("electron");
      let audios = await ipcRenderer.invoke("audio");
      if (audios.filePaths[0]) {
        try {
          document.querySelector(
            ".ql-snow .ql-editor"
          ).innerHTML += `<iframe id="audio" srcdoc="<audio src='file:///${audios.filePaths[0]}' controls></audio>"></iframe>`;
        } catch {
          let swal = require("sweetalert");

          swal("Not Supported");
        }
      }
    },

    // Add Video To Note
    async clickvideo() {
      let { ipcRenderer } = require("electron");
      let videos = await ipcRenderer.invoke("video");
      if (videos.filePaths[0]) {
        try {
          document.querySelector(
            ".ql-snow .ql-editor"
          ).innerHTML += `<iframe srcdoc="<video src='file:///${videos.filePaths[0]}' height='150px' controls preload='none'></video>" id="video"></iframe>`;
        } catch {
          let swal = require("sweetalert");

          swal("Not Supported");
        }
      }
    }
  }
};
</script>
