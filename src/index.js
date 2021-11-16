const clientId = '810552076304121866';
const {
	app,
	BrowserWindow,
	Menu,
	dialog,
	autoUpdater,
	ipcMain
} = require('electron');
const path = require('path');
var fs = require('fs');
const ipc = require('electron').ipcMain;
const {
	findSteam
} = require('find-steam-app');
const cp = require('child_process');
var window;
var os = require('os');
const fetch = require('node-fetch');
var {
	Collection
} = require('discord.js');
var updateStatus = "none";
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	// eslint-disable-line global-require
	app.quit();
}
if (app.isPackaged) {
	const server = 'https://hazel-jacubrstnc.vercel.app';
	const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

	autoUpdater.setFeedURL(feed);
}

async function checkForUpdates() {
	if (app.isPackaged) {
		autoUpdater.checkForUpdates();
	}
}

autoUpdater.on("checking-for-update", () => {
	updateStatus = "none"
	window.webContents.send('update-changed', updateStatus);
})

autoUpdater.on("update-available", () => {
	updateStatus = "downloading"
	window.webContents.send('update-changed', updateStatus);
})

autoUpdater.on("update-downloaded", (ehm) => {
	updateStatus = "ready"
	window.webContents.send('update-changed', updateStatus);
})

autoUpdater.on("update-not-available", () => {
	updateStatus = "none"
	window.webContents.send('update-changed', updateStatus);
})
const DiscordRPC = require('discord-rpc');
var rpc = new DiscordRPC.Client({
	transport: 'ipc'
});
const startTimestamp = new Date();

function nthMostCommon(string, amount) {
	var wordsArrayr = string.split(/\s/);
	var wordsArray = wordsArrayr.filter((f) => f.length > 0).map((f) => String(f).toLowerCase());
	var wordOccurrences = {};
	for (var i = 0; i < wordsArray.length; i++) {
		wordOccurrences['_' + wordsArray[i]] = (wordOccurrences['_' + wordsArray[i]] || 0) + 1;
	}
	var result = Object.keys(wordOccurrences).reduce(function (acc, currentKey) {
		/* you may want to include a binary search here */
		for (var i = 0; i < amount; i++) {
			if (!acc[i]) {
				acc[i] = {
					word: currentKey.slice(1, currentKey.length),
					occurences: wordOccurrences[currentKey]
				};
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
async function getSteamInfo(steamid, notfetch) {

	var rawsteaminfo = await fetch(`https://api.unicorn.wombos.xyz/api/mlauncher/steam/${steamid}`).then(f => f.json());
	let steaminfo;
	if (rawsteaminfo.status == "success" && rawsteaminfo.data.length > 0 && !notfetch) {
		rawsteaminfo = rawsteaminfo.data[0];
		steaminfo = {
			steamid,
			steamname: rawsteaminfo.personaname,
			avatar: rawsteaminfo.avatarfull
		}
	} else {
		steaminfo = {
			steamid: steamid,
			steamname: "not found",
			avatar: ""
		}
	}
	return steaminfo;
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

async function getServer() {
	var SteamLocation = await findSteam();
	if (!SteamLocation) SteamLocation = __dirname
	var monoappdatapath = path.join(process.env.APPDATA, 'monolauncher');
	var monoappdataex = fs.existsSync(monoappdatapath);
	if (!monoappdataex) fs.mkdirSync(monoappdatapath);
	var monoappsettingspath = path.join(monoappdatapath, 'settings');
	var monoappsettex = fs.existsSync(monoappsettingspath);
	if (!monoappsettex) fs.mkdirSync(monoappsettingspath);
	var monoappsettingsfilepath = path.join(monoappsettingspath, 'settings.json');
	var monoappsfileex = fs.existsSync(monoappsettingsfilepath);
	var settings = monoappsfileex ?
		JSON.parse(fs.readFileSync(monoappsettingsfilepath).toString()) : {
			gmod: path.join(SteamLocation, 'steamapps', 'common', 'GarrysMod'),
			ip: '208.103.169.58:27015'
		};
	if (!settings.ip) settings.ip = '208.103.169.58:27015';
	return settings.ip;
}

async function setServer(server) {
	var SteamLocation = await findSteam();
	var monoappdatapath = path.join(process.env.APPDATA, 'monolauncher');
	var monoappdataex = fs.existsSync(monoappdatapath);
	if (!monoappdataex) fs.mkdirSync(monoappdatapath);
	var monoappsettingspath = path.join(monoappdatapath, 'settings');
	var monoappsettex = fs.existsSync(monoappsettingspath);
	if (!monoappsettex) fs.mkdirSync(monoappsettingspath);
	var monoappsettingsfilepath = path.join(monoappsettingspath, 'settings.json');
	var monoappsfileex = fs.existsSync(monoappsettingsfilepath);
	var settings = monoappsfileex ?
		JSON.parse(fs.readFileSync(monoappsettingsfilepath).toString()) : {
			gmod: path.join(SteamLocation, 'steamapps', 'common', 'GarrysMod'),
			ip: server || '208.103.169.58:27015'
		};
	if (!settings.ip) settings.ip = server || '208.103.169.58:27015';
	settings.ip = server;
	try {
		fs.writeFileSync(monoappsettingsfilepath, JSON.stringify(settings));
		window.webContents.send('server-changed', settings.ip);
	} catch (e) { }
	return {
		success: true,
		ip: settings.ip
	};
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
	var settings = monoappsfileex ?
		JSON.parse(fs.readFileSync(monoappsettingsfilepath).toString()) : {
			gmod: path.join(SteamLocation, 'steamapps', 'common', 'GarrysMod'),
			ip: '208.103.169.58:27015'
		};
	return settings.gmod;
}

async function setgmodlocation() {
	var location = dialog.showOpenDialogSync(null, {
		title: "MonoLauncher - Select Garry's Mod Directory",
		properties: ['openDirectory']
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
	var settings = monoappsfileex ?
		JSON.parse(fs.readFileSync(monoappsettingsfilepath).toString()) : {
			gmod: path.join(SteamLocation, 'steamapps', 'common', 'GarrysMod'),
			ip: '208.103.169.58:27015'
		};
	settings.gmod = location;
	try {
		fs.writeFileSync(monoappsettingsfilepath, JSON.stringify(settings));
		window.webContents.send('gmod-changed', settings.gmod);
	} catch (e) { }
	return {
		success: true,
		path: settings.gmod
	};
}

async function launchMonolith() {
	var SteamLocation = await findSteam();
	var ip = await getServer();
	if (!SteamLocation || !ip) {
		const dialogOpts = {
			type: 'error',
			title: 'Error',
			message: "We can't launch Garry's Mod",
			detail: 'Hey yeah.. We had some issues trying to start monolith. This could be because either, we couldnt find the server ip or Steams installation path'
		};

		return dialog.showMessageBox(dialogOpts);
	}
	cp.spawn(`${SteamLocation}/steam.exe`, ['-applaunch', '4000', '+connect', ip]);
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
function formatMPNumber(number) {
	let rnumb = number.replace("7656119", "")
	let fnumb = `${rnumb.slice(0, 3)}-${rnumb.slice(3, 6)}-${rnumb.slice(6, 10)}`
	return fnumb
}

async function getMPContact(sid, nf) {
	return new Promise(async (resolve, reject) => {
		var GmodLocation = await getgmodlocation();
		var monofolder = path.join(GmodLocation, 'garrysmod', 'data', 'monolith');
		if (!fs.existsSync(monofolder)) fs.mkdirSync(monofolder);
		var contactfile = path.join(monofolder, 'monophone_contacts.json');
		if (!fs.existsSync(contactfile)) fs.writeFileSync(contactfile, JSON.stringify({}));
		var contacts = JSON.parse(fs.readFileSync(contactfile).toString());
		var rcontact = contacts[sid] || contacts[sid + "_"];
		var contact = {}
		let steaminfo = await getSteamInfo(sid, nf);
		if (!rcontact) {
			contact.id = sid.replaceAll("_", "");
			contact.number = formatMPNumber(sid);
			contact.name = `Unknown | ${contact.number}` ;
			contact.image = steaminfo.avatar;
		} else {
			contact.id = sid.replaceAll("_", "");
			contact.number = formatMPNumber(sid);
			contact.name =  `${rcontact.Name} | ${contact.number}` ;
			contact.image = steaminfo.avatar;
		}
		resolve(contact)
	});
}
async function getMPContacts(nf) {
	return new Promise(async (resolve, reject) => {
		var GmodLocation = await getgmodlocation();
		try {
			var monofolder = path.join(GmodLocation, 'garrysmod', 'data', 'monolith');
			if (!fs.existsSync(monofolder)) fs.mkdirSync(monofolder);
			var contactfile = path.join(monofolder, 'monophone_contacts.json');
			if (!fs.existsSync(contactfile)) fs.writeFileSync(contactfile, JSON.stringify({}));
			var contacts = JSON.parse(fs.readFileSync(contactfile).toString());
			ncontacts = {}
			for (let k in contacts) {
				k = k.split(".json")[0]
				var contact = getMPContact(k)
				ncontacts[k] = contact
			}

			resolve(ncontacts);
		} catch (e) {
			resolve("404")
		}
	});
}
async function getMPConversation(sid, nf) {
	return new Promise(async (resolve, reject) => {
		var GmodLocation = await getgmodlocation();
		try {
			var monofolder = path.join(GmodLocation, 'garrysmod', 'data', 'monolith');
			if (!fs.existsSync(monofolder)) fs.mkdirSync(monofolder);
			var conversationfolder = path.join(monofolder, 'mono_message');
			if (!fs.existsSync(conversationfolder)) fs.mkdirSync(conversationfolder);
			var convo = JSON.parse(fs.readFileSync(path.join(conversationfolder, `${sid}.json`)).toString());
			var contact = await getMPContact(sid, nf);
			convo.contact = contact;
			resolve(convo)
		} catch (e) {
			resolve("404")
			console.error(e)
		}
	});
}
async function getMPConversations(nf) {
	return new Promise(async (resolve, reject) => {
		var GmodLocation = await getgmodlocation();
		try {
			var monofolder = path.join(GmodLocation, 'garrysmod', 'data', 'monolith');
			if (!fs.existsSync(monofolder)) fs.mkdirSync(monofolder);
			var conversationfolder = path.join(monofolder, 'mono_message');
			if (!fs.existsSync(conversationfolder)) fs.mkdirSync(conversationfolder);
			var conversations = fs.readdirSync(conversationfolder);
			convos = [];
			for (let k in conversations) {
				var convfile = conversations[k];
				var convo = JSON.parse(fs.readFileSync(path.join(conversationfolder, convfile)).toString());
				var sid = convfile.split(".json")[0]
				var contact = await getMPContact(sid, nf);
				convo.contact = contact;
				convos.push(convo)
			}
			resolve(convos)
		} catch (e) {
			resolve("404")
			console.error(e)
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
	rpc.login({
		clientId
	}).catch((err) => {
		if (err) {
			rpc = {
				setActivity: function () { },
				user: {
					username: 'Username',
					discriminator: '0000'
				}
			};
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
	checkForUpdates();
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
	var result = await getMPConversations();
	return result;
});
ipc.handle('request-imsgs-nofetch', async (event, arg) => {
	var result = await getMPConversation(arg, true);
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
ipc.handle('controlbox-action', async (event, arg) => {
	switch (arg) {
		case `minimize`:
			window.isMinimizable() ? window.minimize() : null;
			return;
		case `close`:
			window.isClosable() ? window.close() : null;
			return;
		default:
			return;
	}
});
ipc.handle('request-server', async (event) => {
	var result = await getServer();
	return result;
});
ipc.handle('change-server', async (event, arg) => {
	var result = await setServer(arg);
	return result;
});
ipc.handle('steam-avatar', async (event, arg) => {
	var response = await getSteamInfo(arg)
	return response.avatar;
});
ipc.handle('request-update', async (event) => {
	return updateStatus;
})
ipc.on("restartupdate", async () => {
	autoUpdater.quitAndInstall();
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
	secondWindow.webContents.on('did-finish-load', function () {
		secondWindow.show();
		secondWindow.hide();
	});
});

autoUpdater.on('error', (message) => {
	console.error('There was a problem updating the application');
	console.error(message);
	const dialogOpts = {
		type: 'error',
		title: 'Application Update Error',
		message: 'Error',
		detail: message
	};
	dialog.showMessageBox(dialogOpts);
});

setInterval(setActivity, 16000);
setInterval(checkForUpdates, 60000);