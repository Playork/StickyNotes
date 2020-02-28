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
            <h2>Profile</h2>
            <br />
            <h4 v-on:click="pass" id="pass">
              Change Password/Create Password Of This Profile
            </h4>
            <br />
            <br />
            <h4 v-on:click="createprofile" id="createprofile">
              Create New Profile
            </h4>
            <br />
            <br />
            <h4 v-on:click="deleteprofile" id="deleteprofile">
              Delete This Profile
            </h4>
            <br />
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
import fs from "fs";
import { ipcRenderer } from "electron";

// Vue Class
export default {
  // Do On Start
  mounted() {
    window.setTimeout(() => {
      //  Profile
      let profile;
      fs.readFile("data/profile", async (e, d) => {
        profile = d;
        document.getElementById("profile").value = d;
      });

      // Profiles
      fs.readdir("data", (e, files) => {
        files.forEach(file => {
          if (
            fs.lstatSync("data/" + file).isDirectory() &&
            file != "default" &&
            !new RegExp(`<option value="${file}">${file}</option>`).test(
              document.getElementById("profile").innerHTML
            )
          ) {
            document
              .getElementById("profile")
              .insertAdjacentHTML(
                "beforeend",
                `<option value="${file}">${file}</option>`
              );
          }
        });
      });
      document.getElementById("profile").onchange = () => {
        fs.writeFile(
          "data/profile",
          document.getElementById("profile").value,
          e => {
            ipcRenderer.invoke("reload");
          }
        );
      };

      //TODO: Backup, will be removed in next version
      if (localStorage.getItem("access")) {
        fs.writeFile(
          "data/" + profile + "/.access",
          localStorage.getItem("access"),
          e => {}
        );
        fs.writeFile(
          "data/" + profile + "/sync",
          JSON.stringify(localStorage.getItem("sync")),
          e => {}
        );
      }

      let { Dropbox } = require("dropbox");
      let dbx = new Dropbox({ fetch, clientId: "5wj57sidlrskuzl" });
      let url = dbx.getAuthenticationUrl("app://./auth.html");
      document.getElementById("drb").addEventListener("click", () => {
        let { ipcRenderer } = require("electron");
        ipcRenderer.invoke("syncwindow", url);
      });
      ipcRenderer.on("closedsync", (e, u) => {
        let hash = u.split("#");
        let pair = hash[1].split("&");
        let val = pair[0].split("=");
        fs.writeFile("data/" + profile + "/.access", val[1], e => {});
        fs.writeFile(
          "data/" + profile + "/sync",
          JSON.stringify({ sync: "yes" }),
          e => {}
        );
      });

      fs.readFile("data/" + profile + "/color", (e, d) => {
        if (e) {
          document.getElementById("colorswitch").checked = true;
          fs.writeFile(
            "data/" + profile + "/color",
            JSON.stringify({ on: "yes" }),
            e => {}
          );
        } else {
          d = JSON.parse(d);
          if (d.on == "yes") {
            document.getElementById("colorswitch").checked = true;
          } else {
            document.getElementById("colorswitch").checked = false;
          }
        }
      });
      fs.readFile("data/" + profile + "/emoji", (e, d) => {
        if (e) {
          document.getElementById("emojiswitch").checked = true;
          fs.writeFile(
            "data/" + profile + "/emoji",
            JSON.stringify({ on: "yes" }),
            e => {}
          );
        } else {
          d = JSON.parse(d);
          if (d.on == "yes") {
            document.getElementById("emojiswitch").checked = true;
          } else {
            document.getElementById("emojiswitch").checked = false;
          }
        }
      });
      fs.readFile("data/" + profile + "/warn", (e, d) => {
        if (e) {
          document.getElementById("warnswitch").checked = true;
          fs.writeFile(
            "data/" + profile + "/warn",
            JSON.stringify({ on: "yes" }),
            e => {}
          );
        } else {
          d = JSON.parse(d);
          if (d.on == "yes") {
            document.getElementById("warnswitch").checked = true;
          } else {
            document.getElementById("warnswitch").checked = false;
          }
        }
      });
      fs.readFile("data/" + profile + "/theme", (e, d) => {
        if (e) {
          document.getElementById("theme").selectedIndex = 0;
          fs.writeFile(
            "data/" + profile + "/theme",
            JSON.stringify({ on: 0 }),
            e => {}
          );
        } else {
          d = JSON.parse(d);
          let num = d.on;
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
            fs.writeFile(
              "data/" + profile + "/color",
              JSON.stringify({ on: "yes" }),
              e => {}
            );
          } else {
            fs.writeFile(
              "data/" + profile + "/color",
              JSON.stringify({ on: "no" }),
              e => {}
            );
          }
        };
      });
      document.getElementById("emojiswitch").onclick = () => {
        if (document.getElementById("emojiswitch").checked == true) {
          fs.writeFile(
            "data/" + profile + "/emoji",
            JSON.stringify({ on: "yes" }),
            e => {}
          );
        } else {
          fs.writeFile(
            "data/" + profile + "/emoji",
            JSON.stringify({ on: "no" }),
            e => {}
          );
        }
      };
      document.getElementById("warnswitch").onclick = () => {
        if (document.getElementById("warnswitch").checked == true) {
          fs.writeFile(
            "data/" + profile + "/warn",
            JSON.stringify({ on: "yes" }),
            e => {}
          );
        } else {
          fs.writeFile(
            "data/" + profile + "/warn",
            JSON.stringify({ on: "no" }),
            e => {}
          );
        }
      };
      document.getElementById("theme").onchange = () => {
        let num = document.getElementById("theme").selectedIndex;
        fs.writeFile(
          "data/" + profile + "/theme",
          JSON.stringify({ on: num }),
          e => {}
        );

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
  #window-title2 span:hover {
    color: #000 !important;
  }`;
          document.head.appendChild(lith);
        } else {
          document.head.removeChild(document.getElementById("lighttheme"));
        }
      };
    }, 2000);
  },

  // Functions
  methods: {
    // Create Profile
    createprofile() {
      let swal = require("sweetalert");
      swal({
        title: "Create New Profile",
        content: {
          element: "input",
          attributes: {
            placeholder: "Profile Name"
          }
        },
        closeOnClickOutside: false
      }).then(profile => {
        if (!profile) {
          swal("Not Valid");
        } else {
          if (fs.existsSync("data/" + profile)) {
            swal("Profile Name Already Exist");
          } else {
            fs.mkdirSync("data/" + profile);
            fs.mkdirSync("data/" + profile + "/notes/");
            let pass = () => {
              let swal = require("sweetalert");
              swal({
                title: "Create Password For Protection(Recommend)",
                text: "If You Want No Password Leave This Input Blank",
                content: {
                  element: "input",
                  attributes: {
                    placeholder: "Type your password",
                    type: "password"
                  }
                },
                closeOnClickOutside: false
              }).then(value => {
                if (value) {
                  fs.writeFile("data/" + profile + "/.pass", value, e => {
                    ipcRenderer.invoke("reload");
                  });
                } else {
                  fs.writeFile("data/" + profile + "/pass", "", e => {
                    ipcRenderer.invoke("reload");
                  });
                }
              });
            };
            pass();
          }
        }
      });
    },

    // Delete Profile
    deleteprofile() {
      let swal = require("sweetalert");
      fs.readFile("data/profile", (e, d) => {
        if (d == "default") {
          swal("Can't Delete Default Profile");
        } else {
          swal({
            title: "Are You Sure?",
            text: "Do You Want To Delete This Profile?",
            icon: "warning",
            buttons: true,
            dangerMode: true
          }).then(ok => {
            if (ok) {
              fs.writeFile(
                "data/" + profile + "/closed",
                JSON.stringify({ closed: "yes" }),
                e => {
                  fs.writeFile("data/profile", "default", e => {
                    let deleteFolder = path => {
                      fs.readdir(path, (file, index) => {
                        let curPath = path + "/" + file;
                        if (fs.lstatSync(curPath).isDirectory()) {
                          deleteFolder(curPath);
                        } else {
                          fs.unlink(curPath, e => {});
                        }
                      });
                      fs.rmdir(path, e => {});
                      ipcRenderer.invoke("reload");
                    };
                    deleteFolder("data/" + d);
                  });
                }
              );
            } else {
            }
          });
        }
      });
    },

    // Import Notes
    async importnotes() {
      let profile = "default";
      fs.readFile("data/profile", (e, d) => {
        if (e) {
          profile = "default";
        } else {
          profile = d;
        }
      });
      let { ipcRenderer } = require("electron");
      let notes = await ipcRenderer.invoke("importnotes");
      if (notes.filePaths[0]) {
        fs.readFile(notes.filePaths[0], (e, d) => {
          if (e) {
            let swal = require("sweetalert");
            swal("Not Supported");
          } else {
            if (d != "") {
              d = d.toString().split("\n");
              for (let i = 0; i < d.length; i++) {
                if (i % 2 == 0 && d[i] != "") {
                  let js = JSON.parse(d[i + 1]);
                  fs.readFile("data/" + profile + "/notes/" + d[i], (e, d) => {
                    if (e) {
                      fs.writeFile(
                        "data/" + profile + "/notes/" + id[i],
                        JSON.stringify(js),
                        e => {}
                      );
                    } else {
                      d = JSON.parse(d);
                      if (js.first != d.first || js.image != d.image) {
                        let g = new Date().getTime();
                        let id = Number(d[i]) * g;
                        fs.writeFile(
                          "data/" + profile + "/notes/" + id.toString(),
                          JSON.stringify(js),
                          e => {}
                        );
                      }
                    }
                  });
                }
              }
            }
          }
        });
      }
    },

    // Export Notes
    async exportnotes() {
      let profile = "default";
      fs.readFile("data/profile", (e, d) => {
        if (e) {
          profile = "default";
        } else {
          profile = d;
        }
      });
      if (document.getElementById("notetext")) {
        let { ipcRenderer } = require("electron");
        let notes = await ipcRenderer.invoke("exportnotes");
        if (notes.filePath != undefined) {
          let data = "";
          fs.readdir("data/" + profile + "/notes/", function(e, files) {
            if (e) {
            } else {
              files.forEach(function(key, index) {
                fs.readFile("data/" + profile + "/notes/" + key, (e, d) => {
                  let value = JSON.parse(d);
                  data = data + key + "\n" + JSON.stringify(value) + "\n";
                });
              });
            }
          });
          fs.writeFile(notes.filePath, data, e => {
            if (e) {
              swal("Not Supported");
            }
          });
        }
      } else {
        let swal = require("sweetalert");
        swal("Nothing To Export");
      }
    },

    // Report Bug
    report() {
      let { shell } = require("electron");
      shell.openExternal(
        "mailto:playork@outlook.com?subject=Sticky%20Notes%20Bug"
      );
    },

    // Delete All Note Function
    deleteall() {
      let profile = "default";
      fs.readFile("data/profile", (e, d) => {
        if (e) {
          profile = "default";
        } else {
          profile = d;
        }
      });
      if (document.getElementById("notetext")) {
        fs.readFile("data/" + profile + "/warn", (e, d) => {
          d = JSON.parse(d);
          if (d.on == "yes") {
            let swal = require("sweetalert");
            swal({
              title: "Are you sure?",
              text: "Want To Delete All Notes!",
              icon: "warning",
              buttons: true,
              dangerMode: true
            }).then(willDelete => {
              if (willDelete) {
                fs.writeFile(
                  "data/" + profile + "/closed",
                  JSON.stringify({ closed: "yes" }),
                  e => {
                    window.setTimeout(() => {
                      fs.readdir("data/" + profile + "/notes/", function(
                        e,
                        files
                      ) {
                        if (e) {
                        } else {
                          fs.unlink("data/" + profile + "/closed", e => {});
                          files.forEach(function(key, index) {
                            fs.readFile(
                              "data/" + profile + "/notes/" + key,
                              (e, d) => {
                                let value = JSON.parse(d);
                                fs.unlink(
                                  "data/" + profile + "/notes/" + key,
                                  e => {}
                                );
                              }
                            );
                          });
                        }
                      });
                    }, 800);
                  }
                );
              }
            });
          } else {
            fs.writeFile(
              "data/" + profile + "/closed",
              JSON.stringify({ closed: "yes" }),
              e => {
                window.setTimeout(() => {
                  fs.readdir("data/" + profile + "/notes/", function(e, files) {
                    if (e) {
                    } else {
                      fs.unlink("data/" + profile + "/closed", e => {});
                      files.forEach(function(key, index) {
                        fs.readFile(
                          "data/" + profile + "/notes/" + key,
                          (e, d) => {
                            let value = JSON.parse(d);
                            fs.unlink(
                              "data/" + profile + "/notes/" + key,
                              e => {}
                            );
                          }
                        );
                      });
                    }
                  });
                }, 800);
              }
            );
          }
        });
      } else {
        let swal = require("sweetalert");
        swal("Nothing To Delete");
      }
    },

    // Sign Out
    out() {
      let profile = "default";
      fs.readFile("data/profile", (e, d) => {
        if (e) {
          profile = "default";
        } else {
          profile = d;
        }
      });
      fs.unlink("data/" + profile + "/.access", e => {});
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
      if (!navigator.onLine) {
        let swal = require("sweetalert");
        swal("Your Device Is Offline");
      }
    },

    // Show Sync Page Function
    settingsshow() {
      let id = document.getElementById("settings");
      id.style.display = "block";
      document.getElementById("home").style.overflowY = "hidden";
    },

    // Change Password
    pass() {
      let profile = "default";
      fs.readFile("data/profile", (e, d) => {
        if (e) {
          profile = "default";
        } else {
          profile = d;
        }
      });
      let pass = () => {
        fs.readFile("data/" + profile + "/pass", (error, data) => {
          if (error) {
            fs.readFile("data/" + profile + "/.pass", (e, d) => {
              let swal = require("sweetalert");
              if (e) {
                swal({
                  title: "Create Password For Protection(Recommend)",
                  text: "If You Want No Password Leave This Input Blank",
                  content: {
                    element: "input",
                    attributes: {
                      placeholder: "Type your password",
                      type: "password"
                    }
                  },
                  closeOnClickOutside: false
                }).then(value => {
                  if (value) {
                    fs.writeFile("data/" + profile + "/.pass", value, e => {});
                  } else {
                    fs.writeFile("data/" + profile + "/pass", "", e => {});
                  }
                });
              } else {
                swal({
                  title: "Type Password To Enter",
                  content: {
                    element: "input",
                    attributes: {
                      placeholder: "Type your password",
                      type: "password"
                    }
                  },
                  closeOnClickOutside: false
                }).then(value => {
                  if (value == d) {
                    swal({
                      title: "Change Password",
                      text:
                        "If You Do Not Want To Change Password Leave This Input Blank",
                      content: {
                        element: "input",
                        attributes: {
                          placeholder: "Type your password",
                          type: "password"
                        }
                      },
                      closeOnClickOutside: false
                    }).then(value => {
                      if (value) {
                        fs.writeFile(
                          "data/" + profile + "/.pass",
                          value,
                          e => {}
                        );
                      } else {
                      }
                    });
                  } else {
                    swal({
                      title: "Wrong Password",
                      text: "Do You Do Not Want To Change Password?",
                      icon: "warning",
                      buttons: true,
                      dangerMode: true
                    }).then(ok => {
                      if (ok) {
                      } else {
                        pass();
                      }
                    });
                  }
                });
              }
            });
          }
        });
      };
      pass();
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
