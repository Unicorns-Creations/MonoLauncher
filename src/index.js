const clientId = '810552076304121866';
const { app, BrowserWindow, Menu, dialog, autoUpdater } = require('electron');
const path = require('path');
var fs = require('fs');
const ipc = require('electron').ipcMain;
const { findSteam } = require('find-steam-app');
const cp = require('child_process');
var window;
var os = require('os');
var { Collection } = require('discord.js');
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	// eslint-disable-line global-require
	app.quit();
}
if (app.isPackaged) {
	const server = "https://hazel-eiik04euk-jacubrstnc.vercel.app/"
	const feed = `${server}/update/${process.platform}/${app.getVersion()}`

	autoUpdater.setFeedURL(feed)
}

const DiscordRPC = require('discord-rpc');
var rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

function nthMostCommon(string, amount) {
	var wordsArrayr = string.split(/\s/);
	var wordsArray = wordsArrayr.filter((f) => f.length > 0).map((f) => String(f).toLowerCase());
	var wordOccurrences = {};
	for (var i = 0; i < wordsArray.length; i++) {
		wordOccurrences['_' + wordsArray[i]] = (wordOccurrences['_' + wordsArray[i]] || 0) + 1;
	}
	var result = Object.keys(wordOccurrences).reduce(function(acc, currentKey) {
		/* you may want to include a binary search here */
		for (var i = 0; i < amount; i++) {
			if (!acc[i]) {
				acc[i] = { word: currentKey.slice(1, currentKey.length), occurences: wordOccurrences[currentKey] };
				break;
			} else if (acc[i].occurences < wordOccurrences[currentKey]) {
				acc.splice(i, 0, {
					word: currentKey.slice(1, currentKey.length),
					occurences: wordOccurrences[currentKey]
				});
				if (acc.length > amount) acc.pop();
				break;
			}
		}
		return acc;
	}, []);
	return result;
}

async function getConvInfo() {
	return new Promise(async (resolve, reject) => {
		var convos = await getConversations();
		if (convos == '404') {
			resolve(
				`An error occured in the process of retrieving iMessages. It could possibly be that we simply couldn't find your Garry's Mod installation.`
			);
		}
		var bigmsg = await convos.map((c) => c.chats.map((f) => f.msg).join(' ')).join(' ');
		var camount = convos.size;
		var mostcommonw = nthMostCommon(bigmsg, 20).map((f) => `${f.word} [${f.occurences}]`).join('\n');
		var bignames = await convos.map((c) => c.name).join(' ');
		var mostcommonn = nthMostCommon(bignames, 5).map((f) => `${f.word} [${f.occurences}]`).join('\n');
		resolve(
			`Found ${camount} conversations. Where the 20 most common words are:\n\n${mostcommonw}\nAnd the 5 most common first names/last names are:\n\n${mostcommonn}`.replaceAll(
				'\n',
				'<br>'
			)
		);
	});
}

async function getgmodlocation() {
	var SteamLocation = await findSteam();
	var monoappdatapath = path.join(process.env.APPDATA, 'monolauncher');
	var monoappdataex = fs.existsSync(monoappdatapath);
	if (!monoappdataex) fs.mkdirSync(monoappdatapath);
	var monoappsettingspath = path.join(monoappdatapath, 'settings');
	var monoappsettex = fs.existsSync(monoappsettingspath);
	if (!monoappsettex) fs.mkdirSync(monoappsettingspath);
	var monoappsettingsfilepath = path.join(monoappsettingspath, 'settings.json');
	var monoappsfileex = fs.existsSync(monoappsettingsfilepath);
	var settings = monoappsfileex
		? JSON.parse(fs.readFileSync(monoappsettingsfilepath).toString())
		: {
				gmod: path.join(SteamLocation, 'steamapps', 'common', 'GarrysMod')
			};
	return settings.gmod;
}

async function setgmodlocation() {
	var location = dialog.showOpenDialogSync(null, {
		title: "MonoLauncher - Select Garry's Mod Directory",
		properties: [ 'openDirectory' ]
	});
	if (!location) return 'cancelled';
	var SteamLocation = await findSteam();
	location = location[0];
	var locationex = fs.existsSync(location);
	if (!locationex) return 'location404';
	var folders = fs.readdirSync(location);
	if (!folders) return 'failedread';
	if (!folders.includes('garrysmod')) return 'notgmod';
	var monoappdatapath = path.join(process.env.APPDATA, 'monolauncher');
	var monoappdataex = fs.existsSync(monoappdatapath);
	if (!monoappdataex) fs.mkdirSync(monoappdatapath);
	var monoappsettingspath = path.join(monoappdatapath, 'settings');
	var monoappsettex = fs.existsSync(monoappsettingspath);
	if (!monoappsettex) fs.mkdirSync(monoappsettingspath);
	var monoappsettingsfilepath = path.join(monoappsettingspath, 'settings.json');
	var monoappsfileex = fs.existsSync(monoappsettingsfilepath);
	var settings = monoappsfileex
		? JSON.parse(fs.readFileSync(monoappsettingsfilepath).toString())
		: {
				gmod: path.join(SteamLocation, 'steamapps', 'common', 'GarrysMod')
			};
	settings.gmod = location;
	try {
		fs.writeFileSync(monoappsettingsfilepath, JSON.stringify(settings));
		window.webContents.send('gmod-changed', settings.gmod);
	} catch (e) {}
	return { success: true, path: settings.gmod };
}

async function launchMonolith() {

	var SteamLocation = await findSteam();
	cp.spawn(`${SteamLocation}/steam.exe`, [ '-applaunch', '4000', '+connect', '208.103.169.58:27015' ]);

}

async function getConversations() {
	return new Promise(async (resolve, reject) => {
		var GmodLocation = await getgmodlocation();
		var chatsC = new Collection();
		try {
			var datadir = path.join(GmodLocation, 'garrysmod', 'data');
			var chatdir = path.join(datadir, 'chats');
			var chats = fs.readdirSync(chatdir);
			chats.forEach((chatFile) => {
				var chat = JSON.parse(fs.readFileSync(path.join(chatdir, chatFile)).toString());
				chat.chats = chat.chats.reverse();
				chat.id = chatFile.split('.txt')[0];
				chatsC.set(chatFile.split('.txt')[0], chat);
			});
			resolve(chatsC);
		} catch (e) {
			resolve('404');
		}
	});
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
		width: 1100,
		height: 725,
		title: 'MonoLauncher - Launching',
		toolbar: false,
		frame: false,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});
	mainWindow.setResizable(false);
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
ipc.handle('request-imsgs', async (event) => {
	var result = await getConversations();
	return result;
});
ipc.handle('request-convinfo', async (event) => {
	var result = await getConvInfo();
	return result;
});
ipc.handle('request-gmod', async (event) => {
	var result = await getgmodlocation();
	return result;
});
ipc.handle('set-gmod', async (event) => {
	var result = await setgmodlocation();
	return result;
});
ipc.handle('controlbox-action', async (event,arg) => {
	switch(arg) {
		case `minimize`:
			window.isMinimizable() ? window.minimize() : null;
			return;
		case `close`:
			window.isClosable() ? window.close() : null;
			return;
		default:
			return
	}
})
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
