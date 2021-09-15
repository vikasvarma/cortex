/**
 * 
 */
const electron      = require('electron');
const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isdev         = require('electron-is-dev'); 

function open(){
    appwin = new BrowserWindow({
        width: 1024, 
        height: 720, 
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule:true,
         }
    });

    const url = "http://localhost:3000";
    appwin.loadURL(url);
    if (isdev){
        appwin.webContents.openDevTools()
    }
}

app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});
 

app.whenReady().then(() => {
    open()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            open()
        }
    })
})