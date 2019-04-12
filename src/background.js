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
import { app, protocol, BrowserWindow, ipcMain } from "electron";
import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
require("electron-context-menu")({
  prepend: () => [
    {
      label: "v0.1.0"
    }
  ],
  showInspectElement: false
});
const isDevelopment = process.env.NODE_ENV !== "production";
let win;
protocol.registerStandardSchemes(["app"], { secure: true });
function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 600,
    icon: "public/favicon.ico",
    backgroundColor: "#202020",
    title: "Playork Sticky Notes",
    frame: false,
    resizable: false
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
  }
  win.on("close", e => {
    e.preventDefault();
    app.quit();
    win.destroy();
  });
  win.on("close", e => {
    e.preventDefault();
    win.webContents.send("closeall", "closeit");
    setTimeout(() => {
      win.destroy();
      app.quit();
    }, 150);
  });
  setTimeout(() => {
    win.on("window-all-closed", () => {
      app.quit();
    });
  }, 10000);
}

app.commandLine.appendSwitch("disable-web-security");
let winnote;
function createNote() {
  winnote = new BrowserWindow({
    width: 350,
    height: 375,
    icon: "public/favicon.ico",
    backgroundColor: "#202020",
    title: "Playork Sticky Notes",
    frame: false
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL("http://localhost:8080/#/note");
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html#note");
  }
  win.on("ready-to-show", () => {
    win.show();
    win.focus();
  });
}

ipcMain.on("create-new-instance", () => {
  createNote();
});
app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    await installVueDevtools();
  }
  createWindow();
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
