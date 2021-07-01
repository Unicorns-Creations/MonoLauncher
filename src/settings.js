var { ipcRenderer } = require('electron');
function setGmodDir() {
	ipcRenderer.invoke('set-gmod').then((result) => {
		if (!result.success) {
			switch (result) {
				case `cancelled`:
					return swal(
						'Hmm',
						"It seems like you cancelled the file dialog. Lucky for you, we didn't save it.",
						'info'
					);
				case `location404`:
					return swal(
						'Oops',
						"The location you selected simply doesn't exist. I mean, A for effort?",
						'error'
					);
				case `notgmod`:
					return swal(
						'Shit',
						"It seems like the location you selected isn't the correct Garry's Mod Directory, mind double checking your selection?",
						'error'
					);
				case `failedread`:
					return swal(
						'Ahh sheet',
						"Seems like I dropped my glasses, no but for real. I couldn't read the directory you selected.",
						'error'
					);
			}
		} else {
			setlocation(result.path);
			return swal('Pog', "You changed your Garry's Mod location! Big pog", 'success');
		}
	});
}
function requestgmod() {
	ipcRenderer.invoke('request-gmod').then(async (result) => {
		setlocation(result);
	});
}
function requestserver() {
	ipcRenderer.invoke('request-server').then(async (result) => {
		setserver(result);
	});
}
function setlocation(location) {
	var gld = document.getElementById('gmodLocationDisplay');
	gld.value = String(location);
}

function setserver(server) {
	var gld = document.getElementById(server);
	gld.selected = 'selected';
}

function changeServer(server) {
	ipcRenderer.invoke('change-server', server).then(async (result) => {
		if (result == '404') {
			return swal(
				'Ahh sheet',
				"Seems like we couldn't change the server for some reason, I usually like to blame Jet for issues like this.",
				'error'
			);
		}
		if (result.success) {
			return swal('Wooh!', 'We managed to change the server successfully!', 'success');
		}
	});
}

window.onload = function() {
	requestgmod();
	requestserver();
};

ipcRenderer.on('gmod-changed', (event, message) => {
	setlocation(message);
});

ipcRenderer.on('server-changed', (event, message) => {
	setserver(message);
});
