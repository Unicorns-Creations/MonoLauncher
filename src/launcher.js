const { ipcRenderer } = require('electron');

function launchMonolith() {
	ipcRenderer.send('game-launch');
}
function joinDiscord() {
	ipcRenderer.send('join-discord');
}
