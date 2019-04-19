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

<!-- Body Of Home Page-->
<!-- Html -->
<template>
  <div>
    <div class="start">
      <div>
        <img src="../../assets/sticky.svg" width="300px">
      </div>
    </div>
    <div id="notes"></div>
    <div>
      <div id="options">
        <span v-on:click="syncshow" title="Sync">&#xE895;</span>
        <span id="deleteall" v-on:click="deleteall" title="Delete All Notes">&#xE74D;</span>
        <span v-on:click="aboutshow" title="About">&#xE946;</span>
      </div>
      <div id="sync">
        <span v-on:click="hide">&#xE8BB;</span>
        <div>
          <h1>Sync</h1>
          <button id="drb">Sync With Dropbox</button>
          <p id="sign"></p>
          <a id="out" v-on:click="out"></a>
        </div>
      </div>
      <div id="about">
        <span v-on:click="hide">&#xE8BB;</span>
        <div>
          <img src="../../assets/logo.png" style="padding-top:20px;" width="150px">
          <div style="font-size:30px;">Playork</div>
          <div style="font-size:40px;">Sticky Notes</div>
          <div style="font-size:20px;">bekalshenoy@gmail.com</div>
          <div id="view" style="font-size:20px;">©2019</div>
          <div style="font-size:10px;">
            <a href="https://github.com/Playork/StickyNotes/issues/new" target="_blank">report bug</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Javascript -->
<script>
// Import Required Packages
import store from "store";
import swal from "sweetalert";
import { setTimeout } from "timers";
import { Dropbox } from "dropbox";
import { remote, ipcRenderer, inAppPurchase } from "electron";

// Vue Class
export default {
  // Do On Start
  mounted() {
    let dbx = new Dropbox({ fetch, clientId: "5wj57sidlrskuzl" });
    let authUrl = dbx.getAuthenticationUrl("app://./auth.html");
    document.getElementById("drb").addEventListener("click", () => {
      const win = new remote.BrowserWindow({
        width: 800,
        height: 600,
        icon: "public/favicon.ico",
        backgroundColor: "#202020",
        title: "Playork Sticky Notes",
        resizable: false,
        show: false,
        webPreferences: {
          nodeIntegration: false
        }
      });
      win.loadURL(authUrl);
      win.on("ready-to-show", () => {
        win.show();
        win.focus();
      });
    });
  },

  // Functions
  methods: {
    // Delete All Note Function
    deleteall() {
      swal({
        title: "Are you sure?",
        text: "Want To Delete All Notes!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          store.set("closed", { closed: "yes" });
          if (store.get("closed").closed == "yes") {
            window.setTimeout(() => {
              store.each((value, key) => {
                if (key != "access") {
                  store.remove(key);
                }
              });
            }, 50);
          }
        }
      });
    },

    // Sign Out
    out() {
      store.remove("access");
    },

    // Show About Page Function
    aboutshow() {
      let id = document.getElementById("about");
      id.style.display = "block";
      document.getElementById("home").style.overflowY = "hidden";
    },

    // Show Sync Page Function
    syncshow() {
      let id = document.getElementById("sync");
      id.style.display = "block";
      document.getElementById("home").style.overflowY = "hidden";
    },

    // Hide About Page Function
    hide() {
      document.getElementById("sync").style.display = "none";
      document.getElementById("about").style.display = "none";
      document.getElementById("home").style.overflowY = "auto";
    }
  }
};
</script>
