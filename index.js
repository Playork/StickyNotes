const {Menu} = require('electron')
const electron = require('electron')
const {app, BrowserWindow} = electron
const { autoUpdater } = require('electron-updater');

require('electron-context-menu')({
	prepend: (params, browserWindow) => [{
    label: 'v0.1.0'
  }],
  showInspectElement: false
});

app.on('ready', () => {
  let win = new BrowserWindow({ width: 350, height: 375, icon:'playork.png',backgroundColor: '#ccc', title: "Playork Sticky Notes", frame: false,resizable:false})
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
