const { app, BrowserWindow } = require('electron');
const path = require('path');
const ipc = require('electron').ipcMain;
const { findSteam } = require('find-steam-app');
const cp = require('child_process');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	// eslint-disable-line global-require
	app.quit();
}
async function launchMonolith() {
	var SteamLocation = await findSteam();
	cp.spawn(`${SteamLocation}/steam.exe`, [ '-applaunch', '4000', '+connect', '208.103.169.58:27015' ]);
}
const createWindow = async () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		title: 'MonoLauncher - Launching',
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});
	mainWindow.setMenuBarVisibility(false);
	// and load the index.html of the app.
	await mainWindow.loadFile(path.join(__dirname, 'index.min.html'));
	mainWindow.setTitle('MonoLauncher');
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

ipc.on('game-launch', function(event, arg) {
	launchMonolith();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
