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
function requestgame() {
	ipcRenderer.invoke('request-game').then(async (result) => {
		setgame(result.game);
	});
}
function requestmulticore() {
	ipcRenderer.invoke('request-multicore').then(async (result) => {
		setmulticore(result);
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

function setgame(game) {
	var gld = document.getElementById(game);
	gld.selected = 'selected';
}

function setmulticore(multicore) {
	var gld = document.getElementById(String(multicore));
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

function changeGame(game) {
	ipcRenderer.invoke('change-game', game).then(async (result) => {
		if (!result.success) {
			return swal(
				'Ahh sheet',
				result.error,
				'error'
			);
		}
		if (result.success) {
			return swal('Wooh!', 'We managed to change the game version successfully!', 'success');
		}
	});
}

function changeMulticore(multicore) {
	ipcRenderer.invoke('change-multicore', multicore).then(async (result) => {
		if (result == '404') {
			return swal(
				'Ahh sheet',
				"Seems like we couldn't change the MultiCore status for some reason.",
				'error'
			);
		}
		if (result.success) {
			return swal('Wooh!', 'We managed to change the MultiCore status successfully!', 'success');
		}
	});
}

window.onload = function() {
	requestgmod();
	requestserver();
	requestgame();
	requestmulticore();
};

ipcRenderer.on('gmod-changed', (event, message) => {
	setlocation(message);
});

ipcRenderer.on('server-changed', (event, message) => {
	setserver(message);
});

ipcRenderer.on('game-changed', (event, message) => {
	setgame(message);
});

ipcRenderer.on('multicore-changed', (event, message) => {
	setmulticore(message);
});

function DRPCInfo() {
	swal(
		'Discord RPC',
		'This enables/disables the Rich Presence that MonoLauncher displays in your profile on Discord.'
	)
}