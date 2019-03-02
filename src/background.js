"use strict";
import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
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
    width: 350,
    height: 375,
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
  win.on("closed", () => {
    win = null;
  });
}
function createNote() {
  let win = new BrowserWindow({
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
  win.on("close", event => {
    event.preventDefault();
    const options = {
      type: "warning",
      title: "Delete?",
      message: "Do You Want To Delete The Note?",
      buttons: ["Yes", "No"]
    };
    dialog.showMessageBox(options, index => {
      if (index === 0) {
        win.destroy();
      }
    });
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
