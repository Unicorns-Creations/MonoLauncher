const clientId = '810552076304121866';
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
var fs = require('fs');
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
var rpc = new DiscordRPC.Client({ transport: 'ipc' });
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
		largeImageKey: 'monolith',
		largeImageText: 'Monolith Servers',
		smallImageKey: 'discord',
		smallImageText: 'discord.gg/uj6NRBS'
	});
}

const createWindow = async () => {
	rpc.login({ clientId }).catch((err) => {
		if (err) {
			rpc = { setActivity: function() {}, user: { username: 'Username', discriminator: '0000' } };
		}
	});
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		title: 'MonoLauncher - Launching',
		toolbar: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});
	Menu.setApplicationMenu(null)
	mainWindow.setMenuBarVisibility(false);
	// and load the index.html of the app.
	await mainWindow.loadFile(path.join(__dirname, 'launcher.html'));
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

ipc.on('game-launch', () => {
	launchMonolith();
});
ipc.handle('request-ram', async (event) => {
	var result = getramusage();
	return result;
});
ipc.handle('request-discord', async (event) => {
	var result = `${rpc.user.username}#${rpc.user.discriminator}`;
	return result;
});
ipc.handle('request-pkgjson', async (event) => {
	var result = JSON.parse(fs.readFileSync('package.json').toString());
	return result;
});
ipc.on('join-discord', async () => {
	const secondWindow = new BrowserWindow({
		width: 50,
		height: 50,
		show: false,
		title: 'MonoLauncher Discord',
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true
		}
	});
	secondWindow.loadURL('https://discord.gg/RcAdxHXJ');
	secondWindow.setMenuBarVisibility(false);
	secondWindow.setTitle('Discord Prompt');
	secondWindow.webContents.on('did-finish-load', function() {
		secondWindow.show();
		secondWindow.hide();
	});
});

setInterval(setActivity, 16000);
