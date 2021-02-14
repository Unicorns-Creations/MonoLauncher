const { ipcRenderer } = require('electron');

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
