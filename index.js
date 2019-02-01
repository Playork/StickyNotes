/*MIT License

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
SOFTWARE.*/

const electron = require("electron");
const { app, BrowserWindow, dialog, ipcMain } = electron;
const { autoUpdater } = require("electron-updater");

require("electron-context-menu")({
  prepend: (params, browserWindow) => [
    {
      label: "v0.1.0"
    }
  ],
  showInspectElement: false
});

app.on("ready", () => {
  let win = new BrowserWindow({
    width: 350,
    height: 375,
    icon: "logo.png",
    backgroundColor: "#202020",
    title: "Playork Sticky Notes",
    frame: false,
    resizable: false,
    nodeIntegration: true
  });
  win.loadURL(`file://${__dirname}/index.html`);
  win.on("ready-to-show", function() {
    win.show();
    win.focus();
  });
  autoUpdater
    .checkForUpdatesAndNotify()
    .then(data => console.log("data", data))
    .catch(err => console.log(err));
});
autoUpdater.setFeedURL({
  provider: "github",
  owner: "Playork",
  icon: "logo.png",
  protocol: "https",
  repo: "Sticky-Note"
});
function createWindow() {
  let win = new BrowserWindow({
    width: 350,
    height: 375,
    icon: "logo.png",
    backgroundColor: "#202020",
    title: "Playork Sticky Notes",
    frame: false,
    nodeIntegration: true
  });
  win.loadURL(`file://${__dirname}/index.html#note`);
  win.on("ready-to-show", function() {
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
      } else {
      }
    });
  });
}
ipcMain.on("create-new-instance", () => {
  createWindow();
});
