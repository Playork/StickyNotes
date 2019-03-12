<template>
  <div>
    <div id="selectmedia">
      <span id="songselect" v-on:click="clicksong">&#xEC4F;</span>
      <span id="videoselect" v-on:click="clickvideo">&#xE714;</span>
    </div>
    <div id="lightYellow">
      <div id="editor" data-meteor-emoji="true"></div>
    </div>
  </div>
</template>
<script>
import Quill from "quill";
import store from "store";
import emoji from "./../../assets/meteorEmoji.js";
import JQuery from "jquery";
let $ = JQuery;
import Media from "mediaelement/standalone";
import { remote } from "electron";
export default {
  mounted() {
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
        let text = document.querySelector(".ql-snow .ql-editor").innerHTML;
        let color1 = window
          .getComputedStyle(document.getElementById("lightYellow"))
          .getPropertyValue("background-color");
        let color2 = window
          .getComputedStyle(document.getElementById("titlebar"))
          .getPropertyValue("background-color");
        let winwidth = window.innerWidth.toString();
        let winheight = window.innerHeight.toString();
        store.set(obj.toString(), {
          first: text,
          back: color1,
          title: color2,
          wid: winwidth,
          hei: winheight
        });
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
    new emoji();
    new Media();
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
        songs => {
          if (songs === undefined) return;
          var song = songs[0];
          document.querySelector(
            ".ql-snow .ql-editor"
          ).innerHTML += `<audio src=${song} class="mejs__player" data-mejsoptions='{"alwaysShowControls": "true"}'></audio>`;
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
          var video = videos[0];
          document.querySelector(
            ".ql-snow .ql-editor"
          ).innerHTML += `<video src=${video} class="mejs__player" data-mejsoptions='{"alwaysShowControls": "true"}'></video>`;
        }
      );
    }
  }
};
</script>
