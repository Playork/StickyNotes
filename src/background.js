/* MIT License

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
SOFTWARE. */

"use strict";
let { app, BrowserWindow, ipcMain, Menu, MenuItem, globalShortcut } = require("electron");
let { createProtocol } = require("vue-cli-plugin-electron-builder/lib");

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 350,
    height: 600,
    icon: "public/favicon.png",
    transparent: true,
    title: "Playork Sticky Notes",
    frame: false,
    resizable: false,
    show: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  });
  createProtocol("app");
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    win.loadURL("app://./index.html");
  }
  win.on("ready-to-show", () => {
    win.show();
    win.focus();
  });
  win.on("close", e => {
    e.preventDefault();
    win.webContents.send("closeall", "closeit");
    ipcMain.on("close", () => {
      app.quit()
    });
  });
}

app.on("ready", () => {
  createWindow();
  globalShortcut.register("Control+N", () => {
    if (BrowserWindow.getFocusedWindow()) {
      createNote();
    }
  })
});

app.commandLine.appendSwitch("disable-web-security");
let winnote;
function createNote() {
  winnote = new BrowserWindow({
    width: 300,
    height: 325,
    icon: "public/favicon.png",
    transparent: true,
    title: "Playork Sticky Notes",
    frame: false,
    show: false,
    webPreferences: {
      webSecurity: false,
      spellcheck: true,
      nodeIntegration: true
    }
  });
  winnote.webContents.session.setSpellCheckerLanguages(["en-US"]);
  winnote.webContents.session.setSpellCheckerDictionaryDownloadURL("app://./spell/")
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    winnote.loadURL("http://localhost:8080/#/note");
    if (!process.env.IS_TEST) winnote.webContents.openDevTools();
  } else {
    winnote.loadURL("app://./index.html#note");
  }
  winnote.on("ready-to-show", () => {
    winnote.show();
    winnote.focus();
  });
  winnote.setMinimumSize(300, 325);
  winnote.on("close", () => {
    win.webContents.send("closenote", "closeit");
  });

  winnote.webContents.on(
    "context-menu",
    (e, p) => {
      e.preventDefault();
      let menu = new Menu();
      if (p.misspelledWord) {
        p.dictionarySuggestions.forEach(d => {
          menu.append(
            new MenuItem({
              label: d,
              click: () => {
                winnote.webContents.replaceMisspelling(d);
              }
            })
          );
        });
        menu.append(new MenuItem({ type: "separator" }));
        menu.append(
          new MenuItem({
            label: "Add Word To Dictionary",
            click: () => {
              winnote.webContents.session.addWordToSpellCheckerDictionary(
                p.misspelledWord
              );
            }
          })
        );
      }
      if (p.editFlags.canCut || p.editFlags.canCopy || p.editFlags.canPaste) {
        if (p.misspelledWord) {
          menu.append(new MenuItem({ type: "separator" }));
        }
        menu.append(new MenuItem({ role: "selectall" }));
        if (p.editFlags.canCut) {
          menu.append(new MenuItem({ role: "cut" }));
        }
        if (p.editFlags.canCopy) {
          menu.append(new MenuItem({ role: "copy" }));
        }
        if (p.editFlags.canPaste) {
          menu.append(new MenuItem({ role: "paste" }));
        }
      }
      menu.popup(winnote, p.x, p.y);
    },
    false
  );
}

ipcMain.on("create-new-instance", () => {
  createNote();
});

ipcMain.handle("reload", event => {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
  } else {
    win.loadURL("app://./index.html");
  }
})

ipcMain.handle("close", event => {
  BrowserWindow.getAllWindows().forEach((b) => {
    if (b.webContents == event.sender.webContents) {
      b.close()
    }
  })
})

ipcMain.handle("minimize", event => {
  BrowserWindow.getAllWindows().forEach((b) => {
    if (b.webContents == event.sender.webContents) {
      b.minimize()
    }
  })
})

ipcMain.handle("destroy", event => {
  BrowserWindow.getAllWindows().forEach((b) => {
    if (b.webContents == event.sender.webContents) {
      b.destroy()
    }
  })
})

ipcMain.handle("setMaximumSize", (event, a, c) => {
  BrowserWindow.getAllWindows().forEach((b) => {
    if (b.webContents == event.sender.webContents) {
      b.setMaximumSize(a, c)
    }
  })

})

ipcMain.handle("syncwindow", (e, url) => {
  let syncwindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "public/favicon.png",
    backgroundColor: "#202020",
    title: "Playork Sticky Notes",
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: false
    }
  });
  syncwindow.loadURL(url);
  syncwindow.on("close", () => {
    win.webContents.send("closedsync", syncwindow.webContents.getURL());
  })
  syncwindow.on("ready-to-show", () => {
    syncwindow.show();
    syncwindow.focus();
  });
})

ipcMain.handle("importnotes", async event => {
  let os = require("os");
  let { dialog } = require("electron");
  let path = await dialog.showOpenDialog({
    filters: [
      {
        name: "Notes(.spsd)",
        extensions: ["spsd"]
      }
    ],
    defaultPath: os.homedir() + "/note.spsd"
  });
  return path;
});

ipcMain.handle("exportnotes", async event => {
  let os = require("os");
  let { dialog } = require("electron");
  let path = await dialog.showSaveDialog({
    filters: [
      {
        name: "Notes(.spsd)",
        extensions: ["spsd"]
      }
    ],
    defaultPath: os.homedir() + "/notes.spsd"
  });
  return path;
});

ipcMain.handle("importnote", async event => {
  let os = require("os");
  let { dialog } = require("electron");
  let path = await dialog.showOpenDialog({
    filters: [
      {
        name: "Note(.spst)",
        extensions: ["spst"]
      }
    ],
    defaultPath: os.homedir() + "/note.spst"
  });
  return path;
});

ipcMain.handle("exportnote", async event => {
  let os = require("os");
  let { dialog } = require("electron");
  let path = await dialog.showSaveDialog({
    filters: [
      {
        name: "Note(.spst)",
        extensions: ["spst"]
      }
    ],
    defaultPath: os.homedir() + "/note.spst"
  });
  return path;
});

ipcMain.handle("image", async event => {
  let os = require("os");
  let { dialog } = require("electron");
  let path = await dialog.showOpenDialog({
    filters: [
      {
        name: "Image Files(apng,bmp,ico,cur,jpg,jpeg,jfif,pjpeg,pjp,png,svg,webp)",
        extensions: ["apng", "bmp", "ico", "cur", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp"]
      }
    ],
    defaultPath: os.homedir()
  });
  return path;
});

ipcMain.handle("audio", async event => {
  let os = require("os");
  let { dialog } = require("electron");
  let path = await dialog.showOpenDialog({
    filters: [
      {
        name: "Audo Files(mp3,wav,ogg)",
        extensions: ["mp3", "MP3", "wav", "WAV", "ogg", "OGG"]
      }
    ],
    defaultPath: os.homedir()
  });
  return path;
});

ipcMain.handle("video", async event => {
  let os = require("os");
  let { dialog } = require("electron");
  let path = await dialog.showOpenDialog({
    filters: [
      {
        name: "Video Files(mp4,webm,ogg)",
        extensions: ["mp4", "MP4", "webm", "WEBM", "WebM", "ogg", "OGG", "Ogg"]
      }
    ],
    defaultPath: os.homedir()
  });
  return path;
});
