const { app, BrowserWindow } = require('electron');
const path = require('path');

function crearVentana() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // opcional
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
    // win.webContents.openDevTools(); // Descomenta para depuración
}

app.whenReady().then(() => {
    crearVentana();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) crearVentana();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
