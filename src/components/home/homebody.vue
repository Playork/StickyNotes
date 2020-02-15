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
        <img src="../../assets/sticky.svg" width="300px" />
      </div>
    </div>
    <input type="text" id="search" value placeholder="Search" />
    <span id="searchico">&#xE721;</span>
    <div id="notes"></div>
    <div>
      <div id="options">
        <span id="deleteall" v-on:click="deleteall" title="Delete All Notes"
          >&#xE74D;</span
        >
        <span v-on:click="syncshow" title="Sync">&#xE895;</span>
        <span v-on:click="settingsshow" title="Settings">&#xE713;</span>
        <span v-on:click="importnotes" title="Import Notes">&#xE8B5;</span>
        <span v-on:click="exportnotes" title="Export Notes">&#xEDE1;</span>
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
      <div id="settings">
        <span v-on:click="hide">&#xE8BB;</span>
        <div>
          <h1>Settings</h1>
          <div id="setting">
            <h2>Appearance</h2>
            <br />
            <p>Theme</p>
            <select name="theme" id="theme">
              <option value="Dark" selected>Dark</option>
              <option value="Light">Light</option>
            </select>
            <h2>Features</h2>
            <br />
            <p>Background Colors</p>
            <label class="container">
              <input type="checkbox" id="colorswitch" checked="checked" />
              <span class="checkmark"></span>
            </label>
            <p>Text Suggestions</p>
            <label class="container">
              <input type="checkbox" id="textswitch" checked="checked" />
              <span class="checkmark"></span>
            </label>
            <p>Emoji Selector</p>
            <label class="container">
              <input type="checkbox" id="emojiswitch" checked="checked" />
              <span class="checkmark"></span>
            </label>
            <p>Warn Before Delete</p>
            <label class="container">
              <input type="checkbox" id="warnswitch" checked="checked" />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </div>
      <div id="about">
        <span v-on:click="hide">&#xE8BB;</span>
        <div>
          <img
            src="../../assets/logo.png"
            style="padding-top:20px;"
            width="150px"
          />
          <div style="font-size:30px;">Playork</div>
          <div style="font-size:40px;">Sticky Notes</div>
          <div style="font-size:20px;">bekalshenoy@gmail.com</div>
          <div id="view" style="font-size:20px;">©2020</div>
          <div>
            <p
              id="report"
              v-on:click="report"
              style="font-size:18px;cursor: pointer;"
            >
              report bug
            </p>
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
import { setTimeout, setInterval } from "timers";
import { Dropbox } from "dropbox";
import { remote, ipcRenderer, shell } from "electron";
import os from "os";

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
    if (store.get("color") == undefined) {
      document.getElementById("colorswitch").checked = true;
      store.set("color", { on: "yes" });
    } else {
      if (store.get("color").on == "yes") {
        document.getElementById("colorswitch").checked = true;
      } else {
        document.getElementById("colorswitch").checked = false;
      }
    }
    if (store.get("text") == undefined) {
      document.getElementById("textswitch").checked = true;
      store.set("text", { on: "yes" });
    } else {
      if (store.get("text").on == "yes") {
        document.getElementById("textswitch").checked = true;
      } else {
        document.getElementById("textswitch").checked = false;
      }
    }
    if (store.get("emoji") == undefined) {
      document.getElementById("emojiswitch").checked = true;
      store.set("emoji", { on: "yes" });
    } else {
      if (store.get("emoji").on == "yes") {
        document.getElementById("emojiswitch").checked = true;
      } else {
        document.getElementById("emojiswitch").checked = false;
      }
    }
    if (store.get("warn") == undefined) {
      document.getElementById("warnswitch").checked = true;
      store.set("warn", { on: "yes" });
    } else {
      if (store.get("warn").on == "yes") {
        document.getElementById("warnswitch").checked = true;
      } else {
        document.getElementById("warnswitch").checked = false;
      }
    }
    if (store.get("theme") == undefined) {
      document.getElementById("theme").selectedIndex = 0;
      store.set("theme", { on: 0 });
    } else {
      let num = store.get("theme").on;
      document.getElementById("theme").selectedIndex = num;
      if (num == 1) {
        let lith = document.createElement("style");
        lith.type = "text/css";
        lith.id = "lighttheme";
        lith.innerText = `
  #home {
    background: #ffffffee;
  }
  #titlebar1 {
    background: #ffffffff !important;
    color: #000 !important;
  }
  .button:hover {
    color: #000 !important;
  }
  #search {
    background: #fff;
    color: #000;
  }
  #options {
    color: #000;
    background: #fff;
  }
  #sync,
  #settings,
  #about {
    background: #ffffffee;
    color: #000;
  }
  #sync span,
  #settings span,
  #about span {
    color: #000;
  }
  #theme {
    background: #fff;
    color: #000;
  }
  .swal-modal {
    background: #ffffffee !important;
  }
  .swal-title,
  .swal-text {
    color: #000 !important;
  }
  #window-title2 span:hover {
    color: #000 !important;
  }`;
        document.head.appendChild(lith);
      }
    }
    document.getElementById("colorswitch").onclick = () => {
      if (document.getElementById("colorswitch").checked == true) {
        store.set("color", { on: "yes" });
      } else {
        store.set("color", { on: "no" });
      }
    };
    document.getElementById("textswitch").onclick = () => {
      if (document.getElementById("textswitch").checked == true) {
        store.set("text", { on: "yes" });
      } else {
        store.set("text", { on: "no" });
      }
    };
    document.getElementById("emojiswitch").onclick = () => {
      if (document.getElementById("emojiswitch").checked == true) {
        store.set("emoji", { on: "yes" });
      } else {
        store.set("emoji", { on: "no" });
      }
    };
    document.getElementById("warnswitch").onclick = () => {
      if (document.getElementById("warnswitch").checked == true) {
        store.set("warn", { on: "yes" });
      } else {
        store.set("warn", { on: "no" });
      }
    };
    document.getElementById("theme").onchange = () => {
      let num = document.getElementById("theme").selectedIndex;
      store.set("theme", { on: num });
      if (num == 1) {
        let lith = document.createElement("style");
        lith.type = "text/css";
        lith.id = "lighttheme";
        lith.innerText = `#note,
  #home {
    background: #ffffffee;
  }
  #titlebar1 {
    background: #ffffffff !important;
    color: #000 !important;
  }
  .button:hover {
    color: #000 !important;
  }
  #search {
    background: #fff;
    color: #000;
  }
  #options {
    color: #000;
    background: #fff;
  }
  #sync,
  #settings,
  #about {
    background: #ffffffee;
    color: #000;
  }
  #sync span,
  #settings span,
  #about span {
    color: #000;
  }
  #theme {
    background: #fff;
    color: #000;
  }
  .swal-modal {
    background: #ffffffee !important;
  }
  .swal-title,
  .swal-text {
    color: #000 !important;
  }
  .dropdown-content {
    background-color: #ffffffee !important;
  }
  .dropdown-content a {
    color: #000 !important;
  }
  .dropdown-content a:hover {
    background-color: #eee !important;
  }
  #choosecolor {
    background: #ffffffee !important;
    color: #000 !important;
  }
  .emoji-mart {
    background: #ffffffee !important;
  }
  .emoji-mart-category-label span {
    background: #fff !important;
  }
  .emoji-mart * {
    color: #000 !important;
  }
  .emoji-mart-search input {
    color: #fff !important;
    background: #000;
  }
  #hideemoji {
    color: #000 !important;
    background: #ffffffee !important;
  }
  #window-title2 span:hover {
    color: #000 !important;
  }`;
        document.head.appendChild(lith);
      } else {
        document.head.removeChild(document.getElementById("lighttheme"));
      }
    };
  },

  // Functions
  methods: {
    // Import Notes
    importnotes() {
      remote.dialog.showOpenDialog(
        {
          filters: [
            {
              name: "Notes(.spsd)",
              extensions: ["spsd"]
            }
          ],
          defaultPath: os.homedir() + "/note.spsd"
        },
        notes => {
          if (notes === undefined) return;
          let notesfile = notes[0];
          fs.readFile(notesfile, (e, d) => {
            if (e) {
              swal("Not Supported");
            } else {
              if (d != "") {
                d = d.toString().split("\n");
                for (let i = 0; i < d.length; i++) {
                  if (i % 2 == 0 && d[i] != "") {
                    let js = JSON.parse(d[i + 1]);
                    if (store.get(d[i]) == undefined) {
                      store.set(d[i], js);
                    } else {
                      if (
                        js.first != store.get(d[i]).first ||
                        js.image != store.get(d[i]).image
                      ) {
                        let g = new Date().getTime();
                        let id = Number(d[i]) * g;
                        store.set(id.toString(), js);
                      }
                    }
                  }
                }
              }
            }
          });
        }
      );
    },

    // Export Notes
    exportnotes() {
      remote.dialog.showSaveDialog(
        {
          filters: [
            {
              name: "Notes(.spsd)",
              extensions: ["spsd"]
            }
          ],
          defaultPath: os.homedir() + "/notes.spsd"
        },
        notes => {
          if (notes != undefined) {
            let data = "";
            store.each((value, key) => {
              if (
                key != "id" &&
                key != "loglevel:webpack-dev-server" &&
                key != "closed" &&
                key != "emoji-mart.frequently" &&
                key != "emoji-mart.last" &&
                key != "access" &&
                key != "text" &&
                key != "warn" &&
                key != "color" &&
                key != "emoji" &&
                key != "theme" &&
                key != "default"
              ) {
                data = data + key + "\n" + JSON.stringify(value) + "\n";
              }
            });
            fs.writeFile(notes, data, e => {
              if (e) {
                swal("Not Supported");
              }
            });
          }
        }
      );
    },

    // Report Bug
    report() {
      shell.openExternal(
        "mailto:playork@outlook.com?subject=Sticky%20Notes%20Bug"
      );
    },

    // Delete All Note Function
    deleteall() {
      if (store.get("warn").on == "yes") {
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
                  if (
                    key != "access" &&
                    key != "text" &&
                    key != "warn" &&
                    key != "color" &&
                    key != "emoji" &&
                    key != "theme" &&
                    key != "default"
                  ) {
                    store.remove(key);
                  }
                });
              }, 50);
            }
          }
        });
      } else {
        store.set("closed", { closed: "yes" });
        if (store.get("closed").closed == "yes") {
          store.set("closed", { closed: "yes" });
          window.setTimeout(() => {
            store.each((value, key) => {
              if (
                key != "access" &&
                key != "text" &&
                key != "warn" &&
                key != "color" &&
                key != "emoji" &&
                key != "theme" &&
                key != "default"
              ) {
                store.remove(key);
              }
            });
          }, 50);
        }
      }
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
      if (!navigator.onLine) swal("Your Device Is Offline");
    },

    // Show Sync Page Function
    settingsshow() {
      let id = document.getElementById("settings");
      id.style.display = "block";
      document.getElementById("home").style.overflowY = "hidden";
    },

    // Hide About Page Function
    hide() {
      document.getElementById("sync").style.display = "none";
      document.getElementById("about").style.display = "none";
      document.getElementById("settings").style.display = "none";
      document.getElementById("home").style.overflowY = "auto";
    }
  }
};
</script>
