const { app, BrowserWindow, dialog } = require('electron');
const ipc = require('electron').ipcMain;
const fs = require('fs');

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 640,
    minHeight: 480,
    webPreferences: {
      nodeIntegration: true
    },
    show: false,
    autoHideMenuBar: true,
    fullscreenable: false,
    icon: `${__dirname}/dist/stapler/assets/icon/icon.ico`
  });

  win.loadURL(`file://${__dirname}/dist/stapler/index.html`);
  win.once('ready-to-show', () => win.show());

  // Event when the window is closed.
  win.on('closed', function () {
    win = null;
  });
}

// Create window on electron intialization
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow();
  }
});

ipc.on('toggle-devtools', (event, args) => {
  win.webContents.toggleDevTools();
});


// Open files
ipc.on('open-files', (event, args) => {
  dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'PDF documents', extensions: ['pdf'] },
      { name: 'All files', extensions: ['*'] }
    ]
  }, (filePaths) => {
    if (filePaths && filePaths.length > 0) {
      const files = [];
      filePaths.forEach(path => {
        // Read the files synchronously so we can return them all together
        // Easier to wrap it in a promise on the renderer proc, might be slow if reading a lot/very large files
        // Doesn't lock the renderer process though, so UI should still be responsive
        const data = fs.readFileSync(path);
        if (data) {
          files.push({ path: path, data: data });
        }
      })
      event.reply('file-open-result', {
        status: 'success',
        payload: files
      });
    }
    else {
      // No file paths available means the dialog was either canceled, or no files were selected
      // In either case, reply that the operation was aborted
      event.reply('file-open-result', {
        status: 'canceled'
      });
    }
  });
});


// Save file
ipc.on('save-file', (event, args) => {
  // If data is missing, simply return error
  if (!args || !args.data) {
    event.reply('save-file-result', {
      status: 'error',
      err: 'Bad payload: data is null or undefined (Application Error)'
    });
    return;
  }
  
  // Set default file name
  let defaultFilename = 'export.pdf';
  if (args.defaultFilename && args.defaultFilename != '') {
    defaultFilename = args.defaultFilename;
  }

  dialog.showSaveDialog({
    filters: [{ name: 'PDF documents', extensions: ['pdf'] }],
    defaultPath: defaultFilename
  }, (filename) => {
    if (filename) {
      fs.writeFileSync(filename, args.data);
      event.reply('save-file-result', {
        status: 'success'
      });
    }
    else {
      event.reply('save-file-result', {
        status: 'canceled'
      });
    }
  });
})