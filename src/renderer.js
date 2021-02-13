const { ipcRenderer } = require('electron');

function launchMonolith() {
	ipcRenderer.send('game-launch');
}
