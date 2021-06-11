var { ipcRenderer } = require('electron');
function setGmodDir() {
	ipcRenderer.invoke('set-gmod');
}
function requestgmod() {
	ipcRenderer.invoke('request-gmod').then(async (result) => {
		setlocation(result);
	});
}
function setlocation(location) {
	var gld = document.getElementById('gmodLocationDisplay');
	gld.value = String(location);
}
setInterval(requestgmod, 5000);
window.onload = requestgmod;