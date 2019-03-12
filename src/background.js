"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
import { autoUpdater } from "electron-updater";

autoUpdater.checkForUpdatesAndNotify();
require("electron-context-menu")({
  prepend: () => [
    {
      label: "v0.1.0"
    }
  ],
  showInspectElement: false
});

if (app.isPackaged) {
  app.setLoginItemSettings({
    openAtLogin: true
  });
}

const isDevelopment = process.env.NODE_ENV !== "production";
let win;
protocol.registerStandardSchemes(["app"], { secure: true });
function createWindow() {
  win = new BrowserWindow({
    width: 350,
    height: 600,
    icon: "public/favicon.ico",
    backgroundColor: "#202020",
    title: "Playork Sticky Notes",
    frame: false,
    resizable: false,
    show: false
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
  }
  win.on("ready-to-show", () => {
    win.show();
    win.focus();
  });
  win.on("close", e => {
    e.preventDefault();
    app.quit();
    win.destroy();
  });
}

function createNote() {
  let win;
  app.commandLine.appendSwitch("disable-web-security");
  win = new BrowserWindow({
    width: 350,
    height: 375,
    icon: "public/favicon.ico",
    backgroundColor: "#202020",
    title: "Playork Sticky Notes",
    frame: false,
    show: false,
    webPreferences: {
      webSecurity: false
    }
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

ipcMain.on("closeall", () => {
  app.quit();
});

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
