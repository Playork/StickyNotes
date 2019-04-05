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
        <div id="window-controls">
          <div class="button" id="menus" title="Menu">
            <span id="menu" v-on:click="menu">&#xE712;</span>
            <div id="menu-content" class="dropdown-content">
              <a title="Select Audio" v-on:click="clicksong">Add Audio</a>
              <a title="Select Video" v-on:click="clickvideo">Add Video</a>
              <a v-on:click="printnote" title="Print Note">Print</a>
              <a v-on:click="importnote" title="Import Note">Import</a>
              <a v-on:click="exportnote" title="Export Note">Export</a>
            </div>
          </div>
          <div class="button" id="show" title="Edit Text" v-on:click="showedit">
            <span id="more" class="more">&#xE70F;</span>
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
// Import Required Packages
import { remote } from "electron";
import { setInterval } from "timers";
import fs from "fs";
import swal from "sweetalert";

// Vue Class
export default {
  // Props
  props: {
    close: Function,
    note: Function
  },

  // Functions
  methods: {
    // Locking Note Function
    locks(obj) {
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
          document.getElementById("close").style.display = "none";
          document.getElementById("menu").style.display = "none";
          if (
            document.getElementById("menu-content").classList.contains("show")
          ) {
            document.getElementById("menu-content").classList.remove("show");
          }
          remote.getCurrentWindow().setMaximumSize(350, 375);
          if (select.style.pointerEvents == "auto") {
            document.getElementById("color").style.height = "40px";
            document.getElementById("locks").style.marginLeft = "0";
            document.getElementById("add").style.display = "flex";
            document.getElementById("more").style.display = "flex";
            document.getElementById("close").style.display = "flex";
            document.getElementById("menu").style.display = "flex";
            remote.getCurrentWindow().setMaximumSize(100000, 100000);
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

    // Print Note Function
    printnote() {
      function printElement(e) {
        var ifr = document.createElement("iframe");
        ifr.style = "height: 0px; width: 0px; position: absolute";
        document.body.appendChild(ifr);
        ifr.contentDocument.body.innerHTML = e.innerHTML;
        ifr.contentWindow.print();
        ifr.parentElement.removeChild(ifr);
      }
      printElement(document.querySelector(".ql-snow .ql-editor"));
    },

    // Import Note Function
    importnote() {
      document.getElementById("note").style.pointerEvents = "none";
      remote.dialog.showOpenDialog(
        {
          filters: [
            {
              name: "Note(.spst)",
              extensions: ["spst"]
            }
          ]
        },
        note => {
          document.getElementById("note").style.pointerEvents = "auto";
          if (note === undefined) return;
          let notefile = note[0];
          fs.readFile(notefile, (e, d) => {
            if (e) {
              swal("Not Supported");
            } else {
              d = d.toString().split("\n");
              document.querySelector(".ql-snow .ql-editor").innerHTML = d[0];
              document.getElementById("lightYellow").style.backgroundColor =
                d[1];
              document.getElementById("titlebar").style.backgroundColor = d[2];
              window.resizeTo(Number(d[3]), Number([4]));
            }
          });
        }
      );
    },

    // Exportb Note Function
    exportnote() {
      document.getElementById("note").style.pointerEvents = "none";
      remote.dialog.showSaveDialog(
        {
          filters: [
            {
              name: "Note(.spst)",
              extensions: ["spst"]
            }
          ],
          defaultPath: "note.spst"
        },
        note => {
          document.getElementById("note").style.pointerEvents = "auto";
          if (note === undefined) return;
          fs.writeFile(
            note,
            document.querySelector(".ql-snow .ql-editor").innerHTML +
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
                swal("Not Supported");
              }
            }
          );
        }
      );
    },

    // Add Audio To Note
    clicksong() {
      document.getElementById("note").style.pointerEvents = "none";
      remote.dialog.showOpenDialog(
        {
          filters: [
            {
              name: "Audo Files(mp3,wav,ogg)",
              extensions: ["mp3", "MP3", "wav", "WAV", "ogg", "OGG"]
            }
          ]
        },
        audios => {
          document.getElementById("note").style.pointerEvents = "auto";
          if (audios === undefined) return;
          let audiofile = audios[0];
          try {
            document.querySelector(
              ".ql-snow .ql-editor"
            ).innerHTML += `<iframe id="audio" srcdoc="<audio src='file:///${audiofile}' controls></audio>"></iframe>`;
          } catch {
            swal("Not Supported");
          }
        }
      );
    },

    // Add Video To Note
    clickvideo() {
      document.getElementById("note").style.pointerEvents = "none";
      remote.dialog.showOpenDialog(
        {
          filters: [
            {
              name: "Video Files(mp4,webm,ogg)",
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
          document.getElementById("note").style.pointerEvents = "auto";
          if (videos === undefined) return;
          let videofile = videos[0];
          try {
            document.querySelector(
              ".ql-snow .ql-editor"
            ).innerHTML += `<iframe srcdoc="<video src='file:///${videofile}' height='150px' controls preload='none'></video>" id="video"></iframe>`;
          } catch {
            swal("Not Supported");
          }
        }
      );
    }
  }
};
</script>
