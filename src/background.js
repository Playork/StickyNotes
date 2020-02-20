/* MIT License

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
SOFTWARE. */

"use strict";
let { setTimeout } = require("timers");
let { app, BrowserWindow, ipcMain } = require("electron");
const isDevelopment = process.env.NODE_ENV !== "production";
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
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    let { createProtocol } = require("vue-cli-plugin-electron-builder/lib");
    createProtocol("app");
    win.loadURL("app://./index.html");
  }
  win.on("ready-to-show", () => {
    win.show();
    win.focus();
  });
  win.on("close", e => {
    e.preventDefault();
    win.webContents.send("closeall", "closeit");
    setTimeout(() => {
      win.destroy();
      app.quit();
    }, 150);
  });
}

app.on("activate", () => {
  if (win === null) {
    setTimeout(() => {
      createWindow();
    }, 500);
  }
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
    spellcheck: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    winnote.loadURL("http://localhost:8080/#/note");
    if (!process.env.IS_TEST) winnote.webContents.openDevTools();
  } else {
    let { createProtocol } = require("vue-cli-plugin-electron-builder/lib");
    createProtocol("app");
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
  winnote.webContents.session.setSpellCheckerLanguages["en-US"]
}

ipcMain.on("create-new-instance", () => {
  createNote();
});

app.on("ready", async () => {
  createWindow();
});

require("electron-context-menu")({
  prepend: (defaultActions, params, browserWindow) => {
    let a = []
    params.dictionarySuggestions.forEach((d) => {
      a.push({ label: d })
    })
    return a
  },
  showInspectElement: false
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
