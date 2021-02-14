const clientId = '810552076304121866';
const { app, BrowserWindow } = require('electron');
const path = require('path');
const ipc = require('electron').ipcMain;
const { findSteam } = require('find-steam-app');
const cp = require('child_process');
var window;
var os = require('os');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	// eslint-disable-line global-require
	app.quit();
}
const DiscordRPC = require('discord-rpc');
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();
async function launchMonolith() {
	var SteamLocation = await findSteam();
	cp.spawn(`${SteamLocation}/steam.exe`, [ '-applaunch', '4000', '+connect', '208.103.169.58:27015' ]);
}

function getramusage() {
	var owo = os.totalmem() - os.freemem();
	var awa = owo / 1024 / 1024 / 1024;
	var awo = os.totalmem / 1024 / 1024 / 1024;
	return `${awa.toFixed(2)}/${awo.toFixed(2)}GB (${Math.round(awa / awo * 100)}%)`;
}

async function setActivity() {
	rpc.setActivity({
		details: 'Thinking about joining Monolith',
		state: 'Exploring menus',
		startTimestamp,
		largeImageKey: 'discord-asset-unicorn',
		largeImageText: 'Unicorn :O'
	});
}

const createWindow = async () => {
	rpc.login({ clientId });
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
	setActivity();
	window = mainWindow;
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
ipc.on('request-ram', function(event, arg) {
	window.webContents.send('ram', getramusage());
});
ipc.on('request-discord', (event, arg) => {
	window.webContents.send('discord', `${rpc.user.username}#${rpc.user.discriminator}`);
});

setInterval(setActivity, 16000);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
