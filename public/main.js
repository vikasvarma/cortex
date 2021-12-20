/**
 * 
 */
const electron       = require('electron');
const path           = require('path')
const { spawn }      = require('child_process')
const app            = electron.app;
const BrowserWindow  = electron.BrowserWindow;
const isdev          = require('electron-is-dev'); 
const PY_DIST_FOLDER = 'dist'
const PY_FOLDER      = '../src/server'
const PY_MODULE      = 'app' // without .py suffix
let   pyproc         = null
let   pyport         = null

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

    const URL = "http://localhost:3000";
    appwin.loadURL(URL);
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

const isAPIPacked = () => {
    const fullPath = path.join(__dirname, PY_DIST_FOLDER)
    return require('fs').existsSync(fullPath)
}

const getAPIPath = () => {
    if (!isAPIPacked()) {
        return path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')
    }
    if (process.platform === 'win32') {
        return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE + '.exe')
    } else {
        return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE)
    }
}

const selectPort = () => {
    pyport = 5000
    return pyport
}
  
const createServer = () => {
    let port = '' + selectPort()
    let script = path.join(__dirname, PY_FOLDER, PY_MODULE + '.py')

    pyproc = spawn('python', [script])
    pyproc.stdout.on('data', function (data) {
        console.log("flask: ", data.toString('utf8'));
    });
    pyproc.stderr.on('data', (data) => {
        console.log(`flask: ${data}`); // when error
    });
}
  
const closeServer = () => {
    pyproc.kill()
    pyproc = null
    pyport = null
}

app.on('ready', createServer)
app.on('will-quit', closeServer)