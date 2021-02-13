const { ipcRenderer } = require('electron');

function launchMonolith() {
	ipcRenderer.send('game-launch');
}

function requestram() {
	return ipcRenderer.send('request-ram');
}

ipcRenderer.on('ram', (event, message) => {
	var ramelement = document.getElementById('ram-usage');
	ramelement.innerText = message;
});

setInterval(() => {
	requestram();
}, 500);
