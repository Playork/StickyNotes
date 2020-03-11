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
    if (!fs.existsSync("data")) {
      fs.mkdir("data", e => {});
      fs.mkdir("data/default", e => {});
      fs.mkdir("data/default/notes/", e => {});
    }

    //  Profile
    let profile;
    fs.readFile("data/profile", (e, d) => {
      if (e) {
        profile = "default";
        fs.writeFile("data/profile", "default", e => {});
      } else {
        profile = d;
        document.getElementById("profile").value = d;
      }
    });

    window.setTimeout(() => {
      // Create Password
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
                    fs.writeFile("data/" + profile + "/sign", "", e => {});
                  } else {
                    fs.writeFile("data/" + profile + "/pass", "", e => {});
                    fs.writeFile("data/" + profile + "/sign", "", e => {});
                  }
                  fs.writeFile("data/note", "type", e => {});
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
                    fs.writeFile("data/" + profile + "/sign", "", e => {});
                  } else {
                    swal({
                      title: "Wrong Password",
                      text: "Do You Want To Close?",
                      icon: "warning",
                      buttons: true,
                      dangerMode: true
                    }).then(ok => {
                      if (ok) {
                        this.close();
                      } else {
                        pass();
                      }
                    });
                  }
                });
              }
            });
          } else {
            fs.writeFile("data/" + profile + "/sign", "", e => {});
          }
        });
      };
      pass();

      // TODO:backup
      try {
        fs.readFile("./restore.spst", "binary", (e, d) => {
          if (e) {
          } else {
            if (d != "") {
              d = d.toString().split("\n");
              for (let i = 0; i < d.length; i++) {
                if (i % 2 == 0 && d[i] != "") {
                  if (d[i] == "access") {
                    fs.writeFile(
                      "data/" + profile + "/.access",
                      d[i + 1],
                      e => {}
                    );
                  } else {
                    fs.writeFile(
                      "data/" + profile + "/notes/" + d[i],
                      d[i + 1],
                      e => {}
                    );
                  }
                }
              }
            }
            window.setTimeout(() => {
              fs.unlink("./restore.spst", e => {});
            }, 500);
          }
        });
      } catch {}

      // Sync Seup
      let accesst;
      fs.readFile("data/" + profile + "/.access", (e, d) => {
        if (e) {
          document.getElementById("sign").innerHTML =
            "Not Signed In(Not Syncing)";
          document.getElementById("out").innerHTML = "";
          document.getElementById("drb").innerHTML = "Sync With Dropbox";
        } else {
          accesst = d.toString("utf8");
          document.getElementById("sign").innerHTML = "Signed In(Syncing)";
          document.getElementById("out").innerHTML = "Sign Out";
          document.getElementById("drb").innerHTML =
            "Change Sync Dropbox Account";
        }
      });

      // Upload
      window.setTimeout(() => {
        let dbx = new Dropbox({ fetch, accessToken: accesst });
        let notes = "";
        fs.readdir("data/" + profile + "/notes/", function(e, files) {
          if (e) {
          } else {
            files.forEach(function(key, index) {
              fs.readFile("data/" + profile + "/notes/" + key, (e, d) => {
                notes = notes + key + "\n" + d + "\n";
              });
            });
          }
        });
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
        }, 500);
      }, 4000);

      // Sync Restore
      window.setTimeout(() => {
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
                        fs.readFile(
                          "data/" + profile + "/notes/" + d[i],
                          (e, r) => {
                            if (e) {
                              fs.writeFile(
                                "data/" + profile + "/notes/" + d[i],
                                JSON.stringify(js),
                                e => {}
                              );
                            } else {
                              r = JSON.parse(r);
                              if (js.first != r.first || js.image != r.image) {
                                let g = new Date().getTime();
                                let id = Number(d[i]) * g;
                                fs.writeFile(
                                  "data/" + profile + "/notes/" + id.toString(),
                                  JSON.stringify(js),
                                  e => {}
                                );
                              }
                            }
                          }
                        );
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
      }, 500);

      // close on app.quit()
      ipcRenderer.on("closeall", () => {
        if (
          document.getElementById("deleteall").style.pointerEvents != "none"
        ) {
          fs.unlink("data/" + profile + "/sign", e => {});
          fs.readdir("data/" + profile + "/notes/", function(e, files) {
            if (e) {
            } else {
              files.forEach(function(key, index) {
                fs.readFile("data/" + profile + "/notes/" + key, (e, d) => {
                  let value = JSON.parse(d);
                  if (value.first == "<p><br></p>") {
                    fs.unlink("data/" + profile + "/notes/" + key, e => {});
                  }
                });
              });
            }
          });
          fs.writeFile(
            "data/" + profile + "/closed",
            JSON.stringify({ closed: "yes" }),
            e => {}
          );
          window.setTimeout(() => {
            ipcRenderer.send("close");
            ipcRenderer.invoke("destroy");
          }, 200);
        } else {
          let swal = require("sweetalert");
          swal("Can't Close Note Is Locked");
        }
      });

      // Remove Closed
      fs.unlink("data/" + profile + "/closed", e => {
        if (e) {
        }
      });

      // Sync
      window.setInterval(() => {
        fs.readFile("data/" + profile + "/sync", async (e, p) => {
          if (e || JSON.parse(p).sync == "no") {
            if (!e) {
              fs.unlink("data/" + profile + "/sync", e => {
                if (e) {
                }
              });
            }
            let notes = "";
            fs.readdir("data/" + profile + "/notes/", function(e, files) {
              if (e) {
              } else {
                files.forEach(function(key, index) {
                  fs.readFile("data/" + profile + "/notes/" + key, (e, d) => {
                    notes = notes + key + "\n" + d + "\n";
                  });
                });
              }
            });
            window.setTimeout(() => {
              if (accesst) {
                let dbx = new Dropbox({ fetch, accessToken: accesst });
                dbx
                  .filesUpload({
                    path: "/Playork Sticky Notes/notes.spst",
                    contents: notes,
                    mode: "overwrite"
                  })
                  .catch(() => {});
              }
            }, 500);
          }
        });
      }, 2000);

      // Load Saved Notes
      window.setInterval(() => {
        fs.readFile("data/" + profile + "/sign", e => {
          if (e) {
          } else {
            fs.readFile("data/" + profile + "/.access", (e, d) => {
              if (e) {
                document.getElementById("sign").innerHTML =
                  "Not Signed In(Not Syncing)";
                document.getElementById("out").innerHTML = "";
                document.getElementById("drb").innerHTML = "Sync With Dropbox";
              } else {
                if (accesst != d.toString("utf8")) {
                  accesst = d.toString("utf8");
                  fs.readFile("data/" + profile + "/sync", (e, r) => {
                    if (e) {
                    } else {
                      fs.writeFile(
                        "data/" + profile + "/sync",
                        JSON.stringify({ sync: "no" }),
                        e => {}
                      );
                      let dbx = new Dropbox({ fetch, accessToken: accesst });
                      dbx
                        .filesGetTemporaryLink({
                          path: "/Playork Sticky Notes/notes.spst"
                        })
                        .then(data => {
                          let https = require("https");
                          let file = fs.createWriteStream("notes.spst");
                          let request = https.get(data.link, function(
                            response
                          ) {
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
                                      fs.readFile(
                                        "data/" + profile + "/notes/" + d[i],
                                        (e, r) => {
                                          if (e) {
                                            fs.writeFile(
                                              "data/" +
                                                profile +
                                                "/notes/" +
                                                d[i],
                                              JSON.stringify(js),
                                              e => {
                                                console.log(e);
                                              }
                                            );
                                          } else {
                                            r = JSON.parse(r);
                                            if (
                                              js.first != r.first ||
                                              js.image != r.image
                                            ) {
                                              let g = new Date().getTime();
                                              let id = Number(d[i]) * g;
                                              fs.writeFile(
                                                "data/" +
                                                  profile +
                                                  "/notes/" +
                                                  id.toString(),
                                                JSON.stringify(js),
                                                e => {}
                                              );
                                            }
                                          }
                                        }
                                      );
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
                  document.getElementById("sign").innerHTML =
                    "Signed In(Syncing)";
                  document.getElementById("out").innerHTML = "Sign Out";
                  document.getElementById("drb").innerHTML =
                    "Change Sync Dropbox Account";
                } else {
                  document.getElementById("sign").innerHTML =
                    "Signed In(Syncing)";
                  document.getElementById("out").innerHTML = "Sign Out";
                  document.getElementById("drb").innerHTML =
                    "Change Sync Dropbox Account";
                }
              }
            });
            fs.readdir("data/" + profile + "/notes/", function(e, files) {
              if (e) {
                document.getElementById("notes").innerHTML = "";
              } else {
                document.getElementById("notes").innerHTML = "";
                files.forEach(function(key, index) {
                  try {
                    fs.readFile("data/" + profile + "/notes/" + key, (e, d) => {
                      if (e) {
                      } else {
                        let value = JSON.parse(d);
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
                            `<div id="notetext"><span id="startnote" title="Start Note">&#xE710;</span><span id="deletenote" title="Delete Note">&#xE74D;</span><div id="cont">${content}</div></div>`
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
                                index +
                                  document.getElementById("search").value.length
                              ) +
                              "</span>" +
                              cont.substring(
                                index +
                                  document.getElementById("search").value.length
                              );
                            document.getElementById(
                              "cont"
                            ).innerHTML = highcontent;
                          } else {
                            document.getElementById("notetext").style.display =
                              "none";
                          }
                        }

                        if (value.closed == "yes") {
                          document.getElementById("startnote").style.display =
                            "inline";
                        }
                        if (value.closed == "no") {
                          document.getElementById("startnote").style.display =
                            "none";
                        }
                        if (value.locked == "yes") {
                          document.getElementById(
                            "deletenote"
                          ).style.pointerEvents = "none";
                          document.getElementById(
                            "deleteall"
                          ).style.pointerEvents = "none";
                        }
                        if (value.locked == "no") {
                          document.getElementById(
                            "deletenote"
                          ).style.pointerEvents = "auto";
                          document.getElementById(
                            "deleteall"
                          ).style.pointerEvents = "auto";
                        }
                        document.getElementById("startnote").onclick = () => {
                          let id = new Date().getTime();
                          fs.writeFile(
                            "data/" + profile + "/id",
                            JSON.stringify({ ids: key }),
                            e => {}
                          );
                          ipcRenderer.send("create-new-instance");
                          window.setTimeout(() => {
                            if (value.closed == "no") {
                              fs.writeFile(
                                "data/" + profile + "/id",
                                JSON.stringify({ ids: id }),
                                e => {}
                              );
                            }
                          }, 500);
                        };
                        document.getElementById("deletenote").onclick = () => {
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
                                  "data/" + profile + "/notes/" + key,
                                  JSON.stringify({ deleted: "yes" }),
                                  e => {}
                                );
                              }
                              if (value.closed == "yes") {
                                fs.unlink(
                                  "data/" + profile + "/notes/" + key,
                                  e => {}
                                );
                              }
                            }
                          });
                        };
                        document.getElementById(
                          "notetext"
                        ).style.backgroundColor = value.back;
                        document.getElementById("notetext").style.border =
                          "5px solid " + value.title;
                      }
                    });
                  } catch {}
                });
              }
            });
          }
        });
      }, 2000);
    }, 1000);
  },

  // Functions
  methods: {
    // Close Function
    close() {
      fs.readFile("data/profile", (e, d) => {
        let profile = d;
        if (
          document.getElementById("deleteall").style.pointerEvents != "none"
        ) {
          fs.unlink("data/" + profile + "/sign", e => {});
          fs.readdir("data/" + profile + "/notes/", function(e, files) {
            if (e) {
            } else {
              files.forEach(function(key, index) {
                fs.readFile("data/" + profile + "/notes/" + key, (e, d) => {
                  let value = JSON.parse(d);
                  if (value.first == "<p><br></p>") {
                    fs.unlink("data/" + profile + "/notes/" + key, e => {});
                  }
                });
              });
            }
          });
          fs.writeFile(
            "data/" + profile + "/closed",
            JSON.stringify({ closed: "yes" }),
            e => {}
          );
          window.setTimeout(() => {
            ipcRenderer.invoke("close");
          }, 400);
        } else {
          let swal = require("sweetalert");
          swal("Can't Close Note Is Locked");
        }
      });
    },

    // Start New Note
    note() {
      fs.readFile("data/profile", (e, d) => {
        let profile = d;
        let func = obj => {
          obj++;
          fs.writeFile(
            "data/" + profile + "/id",
            JSON.stringify({ ids: obj.toString() }),
            e => {}
          );
        };
        fs.readFile("data/" + profile + "/id", (e, d) => {
          if (e) {
            let id = 1;
            func(id);
          } else {
            let id = Number(JSON.parse(d).ids);
            func(id);
          }
        });
        ipcRenderer.send("create-new-instance");
      });
    },

    // Minimize Window
    minimize() {
      ipcRenderer.invoke("minimize");
    }
  }
};
</script>
