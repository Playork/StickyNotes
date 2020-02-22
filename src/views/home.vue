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

<!-- Home Page -->
<!-- Html -->
<template>
  <div id="home">
    <titlebar1
      v-bind:close="close"
      v-bind:note="note"
      v-bind:minimize="minimize"
    />
    <homebody />
  </div>
</template>

<!-- Javascript -->
<script>
// Import Required Packages
import { ipcRenderer } from "electron";
import homebody from "../components/home/homebody.vue";
import titlebar1 from "../components/home/titlebar1.vue";
import { Dropbox } from "dropbox/lib/dropbox";
import fs from "fs";

// Vue Class
export default {
  // Components
  components: {
    titlebar1,
    homebody
  },

  // Do On Start
  mounted() {
    // create data
    if (!fs.existsSync("data")) {
      fs.mkdirSync("data");
      fs.mkdirSync("data/notes/");
    }

    // Sync Seup
    let accesst;
    fs.readFile("data/access", (e, d) => {
      if (e) {
        document.getElementById("sign").innerHTML =
          "Not Signed In(Not Syncing)";
        document.getElementById("out").innerHTML = "";
        document.getElementById("drb").innerHTML = "Sync With Dropbox";
      } else {
        accesst = d;
        document.getElementById("sign").innerHTML = "Signed In(Syncing)";
        document.getElementById("out").innerHTML = "Sign Out";
        document.getElementById("drb").innerHTML =
          "Change Sync Dropbox Account";
      }
    });

    // Upload
    if (navigator.onLine) {
      window.setTimeout(() => {
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
      }, 4000);
    }

    // Sync Restore
    if (navigator.onLine) {
      let dbx = new Dropbox({ fetch, accessToken: accesst });
      dbx
        .filesGetTemporaryLink({ path: "/Playork Sticky Notes/notes.spst" })
        .then(data => {
          let https = require("https");
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
                      fs.readFile("data/notes/" + d[i], (e, d) => {
                        if (e) {
                          fs.writeFile(
                            "data/notes/" + id[i],
                            JSON.stringify(js),
                            e => {}
                          );
                        } else {
                          d = JSON.parse(d);
                          if (js.first != d.first || js.image != d.image) {
                            let g = new Date().getTime();
                            let id = Number(d[i]) * g;
                            fs.writeFile(
                              "data/notes/" + id.toString(),
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
          }, 2000);
        })
        .catch(e => {
          if (e) console.log(e);
        });
    }

    // close on app.quit()
    ipcRenderer.on("closeall", () => {
      fs.writeFile("data/closed", JSON.stringify({ closed: "yes" }), e => {});
      window.setTimeout(() => {
        ipcRenderer.invoke("destroy");
      }, 200);
    });

    // Remove Closed
    fs.unlink("data/closed", e => {
      if (e) {
      }
    });

    // Sync
    fs.watch("data/notes/", (e, r) => {
      if (navigator.onLine) {
        fs.readFile("data/sync", (e, d) => {
          if (e || JSON.parse(d).sync == "no") {
            if (!e) {
              fs.unlink("data/sync", e => {
                if (e) {
                }
              });
            }
            let notes = "";
            fs.readdir("data/notes/", function(e, files) {
              if (e) {
              } else {
                files.forEach(function(key, index) {
                  fs.readFile("data/notes/" + key, (e, d) => {
                    let value = JSON.parse(d);
                    notes = notes + key + "\n" + JSON.stringify(value) + "\n";
                  });
                });
              }
            });
            fs.readFile("data/access", (e, d) => {
              if (e) {
              } else {
                let dbx = new Dropbox({ fetch, accessToken: accesst });
                dbx
                  .filesUpload({
                    path: "/Playork Sticky Notes/notes.spst",
                    contents: notes,
                    mode: "overwrite"
                  })
                  .catch(() => {});
              }
            });
          }
        });
      }
    });

    // Load Saved Notes
    window.setInterval(() => {
      if (navigator.onLine) {
        fs.readFile("data/sync", (e, d) => {
          if (e) {
          } else {
            fs.writeFile("data/sync", JSON.stringify({ sync: "no" }), e => {});
            let dbx = new Dropbox({ fetch, accessToken: accesst });
            dbx
              .filesGetTemporaryLink({
                path: "/Playork Sticky Notes/notes.spst"
              })
              .then(data => {
                let https = require("https");
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
                            fs.readFile("data/notes/" + d[i], (e, d) => {
                              if (e) {
                                fs.writeFile(
                                  "data/notes/" + id[i],
                                  JSON.stringify(js),
                                  e => {}
                                );
                              } else {
                                d = JSON.parse(d);
                                if (js.first != d.first) {
                                  let g = new Date().getTime();
                                  let id = Number(d[i]) * g;
                                  fs.writeFile(
                                    "data/notes/" + id.toString(),
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
                }, 2000);
              })
              .catch(e => {
                if (e) console.log(e);
              });
          }
        });
      }
      fs.readFile("data/access", (e, d) => {
        if (e) {
          document.getElementById("sign").innerHTML =
            "Not Signed In(Not Syncing)";
          document.getElementById("out").innerHTML = "";
          document.getElementById("drb").innerHTML = "Sync With Dropbox";
        } else {
          if (d != accesst) {
            accesst = d;
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
      });
      fs.readdir("data/notes/", function(e, files) {
        if (e) {
          document.getElementById("notes").innerHTML = "";
        } else {
          document.getElementById("notes").innerHTML = "";
          files.forEach(function(key, index) {
            try {
              fs.readFile("data/notes/" + key, (e, d) => {
                let value = JSON.parse(d);
                document
                  .getElementById("notes")
                  .insertAdjacentHTML(
                    "afterbegin",
                    `<div id="notetext"><span id="startnote" title="Start Note">&#xE710;</span><span id="deletenote" title="Delete Note">&#xE74D;</span><div id="cont">${value.first}</div></div>`
                  );
                if (document.getElementById("search").value != "") {
                  let cont = document.getElementById("cont").innerHTML;
                  let index = cont.indexOf(
                    document.getElementById("search").value
                  );
                  if (index >= 0) {
                    let highcontent =
                      cont.substring(0, index) +
                      "<span style='background-color: yellow;border-radius:10px;'>" +
                      cont.substring(
                        index,
                        index + document.getElementById("search").value.length
                      ) +
                      "</span>" +
                      cont.substring(
                        index + document.getElementById("search").value.length
                      );
                    document.getElementById("cont").innerHTML = highcontent;
                  } else {
                    document.getElementById("notetext").style.display = "none";
                  }
                }

                if (value.closed == "yes") {
                  document.getElementById("startnote").style.display = "inline";
                }
                if (value.closed == "no") {
                  document.getElementById("startnote").style.display = "none";
                }
                if (value.locked == "yes") {
                  document.getElementById("deletenote").style.pointerEvents =
                    "none";
                  document.getElementById("deleteall").style.pointerEvents =
                    "none";
                }
                if (value.locked == "no") {
                  document.getElementById("deletenote").style.pointerEvents =
                    "auto";
                  document.getElementById("deleteall").style.pointerEvents =
                    "auto";
                }
                document.getElementById("startnote").onclick = () => {
                  let id = new Date().getTime();
                  fs.writeFile(
                    "data/id",
                    JSON.stringify({ ids: key }),
                    e => {}
                  );
                  ipcRenderer.send("create-new-instance");
                  window.setTimeout(() => {
                    if (value.closed == "no") {
                      fs.writeFile(
                        "data/id",
                        JSON.stringify({ ids: id }),
                        e => {}
                      );
                    }
                  }, 500);
                };
                document.getElementById("deletenote").onclick = () => {
                  fs.readFile("data/warn", (e, d) => {
                    if (JSON.parse(d).on == "yes") {
                      let swal = require("sweetalert");
                      swal({
                        title: "Are you sure?",
                        text: "Want To Delete Your Note!",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true
                      }).then(willDelete => {
                        if (willDelete) {
                          if (value.closed == "no") {
                            fs.writeFile(
                              "data/notes/" + key,
                              JSON.stringify({ deleted: "yes" }),
                              e => {}
                            );
                          }
                          if (value.closed == "yes") {
                            fs.unlink("data/notes/" + key, e => {});
                          }
                        }
                      });
                    } else {
                      if (value.closed == "no") {
                        fs.writeFile(
                          "data/notes/" + key,
                          JSON.stringify({ deleted: "yes" }),
                          e => {}
                        );
                      }
                      if (value.closed == "yes") {
                        fs.unlink("data/notes/" + key, e => {});
                      }
                    }
                  });
                };
                document.getElementById("notetext").style.backgroundColor =
                  value.back;
                document.getElementById("notetext").style.border =
                  "5px solid " + value.title;
              });
            } catch {}
          });
        }
      });
    }, 2000);
  },

  // Functions
  methods: {
    // Close Function
    close() {
      if (document.getElementById("deleteall").style.pointerEvents != "none") {
        fs.readdir("data/notes/", function(e, files) {
          if (e) {
          } else {
            files.forEach(function(key, index) {
              fs.readFile("data/notes/" + key, (e, d) => {
                let value = JSON.parse(d);
                if (value.first == "<p><br></p>") {
                  fs.unlink("data/notes/" + key, e => {});
                }
              });
            });
          }
        });
        fs.writeFile("data/closed", JSON.stringify({ closed: "yes" }), e => {});
        window.setTimeout(() => {
          ipcRenderer.invoke("close");
        }, 400);
      } else {
        let swal = require("sweetalert");
        swal("Can't Close Note Is Locked");
      }
    },

    // Start New Note
    note() {
      let func = obj => {
        obj++;
        fs.writeFile(
          "data/id",
          JSON.stringify({ ids: obj.toString() }),
          e => {}
        );
      };
      fs.readFile("data/id", (e, d) => {
        if (e) {
          let id = 1;
          func(id);
        } else {
          let id = Number(JSON.parse(d).ids);
          func(id);
        }
      });
      ipcRenderer.send("create-new-instance");
    },

    // Minimize Window
    minimize() {
      ipcRenderer.invoke("minimize");
    }
  }
};
</script>
