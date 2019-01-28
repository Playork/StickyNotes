<template>
  <div id="body">
    <div>
      <header id="titlebar1" style="position:fixed;background:#333 !important;">
        <div id="drag-region">
          <div id="window-title">
            <span style="color:#fff;font-size:25px;">Sticky Note</span>
          </div>
          <div id="window-controls">
            <div class="button" v-on:click="close" id="close-button">
              <span>&#xE8BB;</span>
            </div>
          </div>
        </div>
      </header>
      <div id="options">
        <span v-on:click="aboutshow">&#xE946;</span>
        <a href="#help" target="_blank">
          <span>&#xE897;</span>
        </a>
      </div>
      <div id="about">
        <span v-on:click="hide">&#xE8BB;</span>
        <div>
          <img src="../assets/logo.png" style="padding-top:20px;" width="150px">
          <div style="font-size:30px;">Playork</div>
          <div style="font-size:40px;">Sticky Notes</div>
          <div style="font-size:20px;">Author: B. Ramnath Shenoy</div>
          <div style="font-size:20px;">bekalshenoy@gmail.com</div>
          <div id="view" style="font-size:20px;">©2018-19</div>
        </div>
      </div>
    </div>

    <div class="start">
      <span v-on:click="note">&#xE710;</span>
    </div>
  </div>
</template>
<script>
import { remote, ipcRenderer } from "electron";
import JQuery from "jquery";
let $ = JQuery;
export default {
  methods: {
    close: function() {
      remote.getCurrentWindow().close();
    },
    note: function() {
      ipcRenderer.send("create-new-instance");
    },
    aboutshow: function() {
      $("#about").css("display", "block");
    },
    hide: function() {
      $("#about").css("display", "none");
    }
  }
};
</script>
<style>
@font-face {
  font-family: "Lobster";
  src: url(../assets/Lobster.woff2) format("woff2");
}
@font-face {
  font-family: "segoe";
  src: url(../assets/SegMDL2.ttf);
}
#body {
  user-select: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: "Lobster";
  background: #202020;
}
button {
  outline: none;
}
.start {
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
  width: 100%;
  grid-template-rows: 100%;
}
.start span {
  padding-top: 35%;
  font-family: segoe;
  color: #fff;
  font-size: 150px;
  text-align: center;
}
.start div {
  color: #fff;
  font-family: Lobster;
  text-align: center;
}
#titlebar1 {
  transition: height 0.3s ease-in-out;
  display: block;
  position: fixed;
  height: 32px;
  width: 100%;
  min-width: 300px;
  background: #cccc00;
  padding: 4px !important;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 100%;
  z-index: 8;
}
#drag-region {
  width: 100% !important;
  height: 100%;
  -webkit-app-region: drag;
  display: grid;
  grid-template-columns: auto 138px;
}
#window-controls {
  display: grid;
  grid-template-columns: repeat(2, 40px) !important;
  position: absolute;
  top: 0 !important;
  right: 15px !important;
  height: 100%;
  font-size: 25px;
  -webkit-app-region: no-drag;
  align-items: center;
}
.button {
  grid-row: 1 / span 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100% !important;
  height: 100% !important;
  font-family: "segoe" !important;
  background: none;
  user-select: none;
  cursor: default;
}
#min-button {
  grid-column: 1;
}
#close-button {
  grid-column: 2;
}
.button:hover {
  background: rgba(255, 255, 255, 0.4);
  opacity: 1;
}
#min-button:hover,
#close-button:hover {
  box-shadow: none !important;
}
#close-button:hover {
  background: #e81123;
  color: #fff;
}
.button:hover {
  color: #fff;
}
.new {
  font-family: segoe !important;
}
#window-title span {
  font-family: "Lobster";
}
.buttons {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: none;
}
#options {
  position: absolute;
  top: 45px;
  bottom: 100%;
  left: 88%;
}
#options span {
  color: #fff;
  padding-right: 5px;
  font-family: "segoe";
}
#about {
  display: none;
}
#help {
  display: none;
}

#about {
  background: #202020;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-family: "Lobster";
  z-index: 7;
  padding-top: 35px;
  text-align: center;
  display: none;
  color: #fff;
}
#about span {
  position: absolute;
  top: 45px;
  bottom: 100%;
  left: 5px;
  color: #fff;
  font-family: "segoe";
}
</style>
