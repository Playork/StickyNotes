const {Menu} = require('electron')
const electron = require('electron')
const {app, BrowserWindow, dialog} = electron
const { autoUpdater } = require('electron-updater');
const { ipcMain } = require('electron')

require('electron-context-menu')({
	prepend: (params, browserWindow) => [{
    label: 'v0.1.0'
  }],
  showInspectElement: false
});

app.on('ready', () => {
  let win = new BrowserWindow({ width: 350, height: 375, icon:'playork.png',backgroundColor: '#ccc', title: "Playork Sticky Notes", frame: false, resizable:false, nodeIntegration: true})
  win.loadURL(`file://${__dirname}/index.html`)
  win.on('ready-to-show', function() { 
  win.show(); 
  win.focus();
  });
  autoUpdater.checkForUpdatesAndNotify() 
    .then((data) => console.log('data', data)) 
    .catch((err) => console.log(err));
});
autoUpdater.setFeedURL({ 
  provider: 'github', 
  owner: 'Playork', 
  protocol: 'https', 
  repo: 'Sticky-Note'
});
function createWindow () {
  let win = new BrowserWindow({ width: 350, height: 375, icon:'playork.png',backgroundColor: '#FFF2AB', title: "Playork Sticky Notes", frame: false, nodeIntegration: true})
  win.loadURL(`file://${__dirname}/note.html`)
  win.on('ready-to-show', function() { 
  win.show(); 
  win.focus();
  });
  win.on('close', (event) => {
    event.preventDefault()
    const options = {
      type: 'warning',
      title: 'Delete?',
      message: 'Do You Want To Delete The Note?',
      buttons: ['Yes', 'No']
    }

    dialog.showMessageBox(options, (index) => {
      if (index === 0) {win.destroy()}
      else{}
    })
  })
}
ipcMain.on('create-new-instance',()=>{
  createWindow();
})