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

<!-- Home Page -->
<!-- Html -->
<template>
  <div id="home">
    <titlebar1 v-bind:close="close" v-bind:note="note"/>
    <homebody/>
  </div>
</template>

<!-- Javascript -->
<script>
// Import Required Packages
import { remote, ipcRenderer } from "electron";
import swal from "sweetalert";
import homebody from "../components/home/homebody.vue";
import titlebar1 from "../components/home/titlebar1.vue";
import store from "store";
import { setTimeout, setInterval } from "timers";
import os from "os";
import { Dropbox } from "dropbox/lib/dropbox";
import fs from "fs";
import https from "https";

// Vue Class
export default {
  // Components
  components: {
    titlebar1,
    homebody
  },

  // Do On Start
  mounted() {
    // Before Close
    window.onbeforeunload = () => {
      dbx
        .filesDeleteV2({ path: "/Playork Sticky Notes/notes.spst" })
        .then(() => {
          dbx
            .filesUpload({
              path: "/Playork Sticky Notes/notes.spst",
              contents: notes
            })
            .catch(() => {});
        })
        .catch(e => {
          if (e) {
            dbx
              .filesUpload({
                path: "/Playork Sticky Notes/notes.spst",
                contents: notes
              })
              .catch(() => {});
          }
        });
    };
    window.setTimeout(() => {
      dbx
        .filesDeleteV2({ path: "/Playork Sticky Notes/notes.spst" })
        .then(() => {
          dbx
            .filesUpload({
              path: "/Playork Sticky Notes/notes.spst",
              contents: notes
            })
            .catch(() => {});
        })
        .catch(e => {
          if (e) {
            dbx
              .filesUpload({
                path: "/Playork Sticky Notes/notes.spst",
                contents: notes
              })
              .catch(() => {});
          }
        });
    }, 4000);

    // Sync Restore
    let accesst;
    if (localStorage.getItem("access") == undefined) {
      document.getElementById("sign").innerHTML = "Not Signed In(Not Syncing)";
      document.getElementById("out").innerHTML = "";
      document.getElementById("drb").innerHTML = "Sync With Dropbox";
    } else {
      accesst = localStorage.getItem("access");
      document.getElementById("sign").innerHTML = "Signed In(Syncing)";
      document.getElementById("out").innerHTML = "Sign Out";
      document.getElementById("drb").innerHTML = "Change Sync Dropbox Account";
    }
    let dbx = new Dropbox({ fetch, accessToken: accesst });
    dbx
      .filesGetTemporaryLink({ path: "/Playork Sticky Notes/notes.spst" })
      .then(data => {
        let file = fs.createWriteStream("notes.spst");
        let request = https.get(data.link, function(response) {
          response.pipe(file);
          file.on("finish", function() {
            file.close();
          });
        });
        window.setTimeout(() => {
          fs.readFile("./notes.spst", "binary", (e, d) => {
            if (e) {
              console.log(e);
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
        }, 2000);
      })
      .catch(e => {
        if (e) console.log(e);
      });

    // close on app.quit()
    ipcRenderer.on("closeall", () => {
      store.set("closed", { closed: "yes" });
      remote.getCurrentWindow().destroy();
    });

    // Remove Closed
    store.remove("closed");

    // Sync
    window.setTimeout(() => {
      window.setInterval(() => {
        if (store.get("sync") == undefined || store.get("sync").sync == "no") {
          try {
            if (store.get("sync").sync == "no") {
              store.remove("sync");
            }
          } catch {}
          let notes = "";
          store.each((value, key) => {
            if (
              key != "id" &&
              key != "loglevel:webpack-dev-server" &&
              key != "closed" &&
              key != "emoji-mart.frequently" &&
              key != "emoji-mart.last" &&
              key != "access"
            ) {
              notes = notes + key + "\n" + JSON.stringify(value) + "\n";
            }
          });
          if (store.get("access") != undefined) {
            let dbx = new Dropbox({ fetch, accessToken: accesst });
            dbx
              .filesDeleteV2({ path: "/Playork Sticky Notes/notes.spst" })
              .then(() => {
                dbx
                  .filesUpload({
                    path: "/Playork Sticky Notes/notes.spst",
                    contents: notes
                  })
                  .catch(() => {});
              })
              .catch(e => {
                if (e) {
                  dbx
                    .filesUpload({
                      path: "/Playork Sticky Notes/notes.spst",
                      contents: notes
                    })
                    .catch(() => {});
                }
              });
          }
        }
      }, 2500);
    }, 2500);

    // Load Saved Notes
    window.setInterval(() => {
      if (store.get("sync") != undefined) {
        store.set("sync", { sync: "no" });
        let dbx = new Dropbox({ fetch, accessToken: accesst });
        dbx
          .filesGetTemporaryLink({ path: "/Playork Sticky Notes/notes.spst" })
          .then(data => {
            let file = fs.createWriteStream("notes.spst");
            let request = https.get(data.link, function(response) {
              response.pipe(file);
              file.on("finish", function() {
                file.close();
              });
            });
            window.setTimeout(() => {
              fs.readFile("./notes.spst", "binary", (e, d) => {
                if (e) {
                  console.log(e);
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
            }, 2000);
          })
          .catch(e => {
            if (e) console.log(e);
          });
      }
      if (localStorage.getItem("access") == undefined) {
        document.getElementById("sign").innerHTML =
          "Not Signed In(Not Syncing)";
        document.getElementById("out").innerHTML = "";
        document.getElementById("drb").innerHTML = "Sync With Dropbox";
      } else {
        if (localStorage.getItem("access") != accesst) {
          accesst = localStorage.getItem("access");
          document.getElementById("sign").innerHTML = "Signed In(Syncing)";
          document.getElementById("out").innerHTML = "Sign Out";
          document.getElementById("drb").innerHTML =
            "Change Sync Dropbox Account";
        } else {
          document.getElementById("sign").innerHTML = "Signed In(Syncing)";
          document.getElementById("out").innerHTML = "Sign Out";
          document.getElementById("drb").innerHTML =
            "Change Sync Dropbox Account";
        }
      }
      document.getElementById("notes").innerHTML = "";
      store.each((value, key) => {
        if (
          key != "id" &&
          key != "loglevel:webpack-dev-server" &&
          key != "closed" &&
          key != "emoji-mart.frequently" &&
          key != "emoji-mart.last" &&
          key != "access" &&
          key != "sync"
        ) {
          let content;
          if (value.first == undefined) {
            content = `<img src="${value.image}" style="max-width:90%;"`;
          } else {
            content = value.first;
          }
          document
            .getElementById("notes")
            .insertAdjacentHTML(
              "afterbegin",
              `<div id="notetext"><span id="startnote" title="Start Note">&#xE710;</span><span id="deletenote" title="Delete Note">&#xE74D;</span>${content}</div>`
            );

          if (value.closed == "yes") {
            document.getElementById("startnote").style.display = "inline";
          }
          if (value.closed == "no") {
            document.getElementById("startnote").style.display = "none";
          }
          if (value.locked == "yes") {
            document.getElementById("deletenote").style.pointerEvents = "none";
            document.getElementById("deleteall").style.pointerEvents = "none";
          }
          if (value.locked == "no") {
            document.getElementById("deletenote").style.pointerEvents = "auto";
            document.getElementById("deleteall").style.pointerEvents = "auto";
          }
          document.getElementById("startnote").onclick = () => {
            let id = new Date().getTime();
            store.set("id", { ids: key });
            ipcRenderer.send("create-new-instance");
            window.setTimeout(() => {
              if (value.closed == "no") {
                store.set("id", { ids: id });
              }
            }, 500);
          };
          document.getElementById("deletenote").onclick = () => {
            swal({
              title: "Are you sure?",
              text: "Want To Delete Your Note!",
              icon: "warning",
              buttons: true,
              dangerMode: true
            }).then(willDelete => {
              if (willDelete) {
                if (value.closed == "no") {
                  store.set(key, { deleted: "yes" });
                }
                if (value.closed == "yes") {
                  store.remove(key);
                }
              }
            });
          };
          document.getElementById("notetext").style.backgroundColor =
            value.back;
          document.getElementById("notetext").style.border =
            "5px solid " + value.title;
        }
      });
    }, 2000);
    // let start = store.get("id").ids;
    // store.each((value, key) => {
    //   if (key != "id" && key != "loglevel:webpack-dev-server") {
    //     if (store.get("id").ids == start) {
    //       store.set("id", { ids: key });
    //       ipcRenderer.send("create-new-instance");
    //     }
    //   }
    // });
  },

  // Functions
  methods: {
    // Close Function
    close() {
      if (document.getElementById("deleteall").style.pointerEvents != "none") {
        store.each((value, key) => {
          if (key != "id" && key != "loglevel:webpack-dev-server") {
            if (value.first == "<p><br></p>") {
              store.remove(key);
            }
          }
        });
        store.set("closed", { closed: "yes" });
        window.setTimeout(() => {
          remote.getCurrentWindow().close();
        }, 100);
      } else {
        swal("Can't Close Note Is Locked");
      }
    },

    // Start New Note
    note() {
      let func = obj => {
        obj++;
        store.set("id", { ids: obj.toString() });
      };
      try {
        let id = Number(store.get("id").ids);
        func(id);
      } catch {
        let id = 0;
        func(id);
      }
      ipcRenderer.send("create-new-instance");
    }
  }
};
</script>