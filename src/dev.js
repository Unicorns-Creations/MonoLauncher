const { ipcRenderer } = require('electron');

function requestram() {
	return ipcRenderer.send('request-ram');
}

function requestdiscord() {
	return ipcRenderer.send('request-discord');
}

ipcRenderer.on('ram', (event, message) => {
	var ramelement = document.getElementById('ram-usage');
	ramelement.innerText = message;
});

ipcRenderer.on('discord', (event, message) => {
	var diselement = document.getElementById('discord');
	diselement.innerText = message;
});

setInterval(() => {
	requestram();
	requestdiscord();	
}, 500);
