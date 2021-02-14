var gamedig = require('gamedig');
function toTimeFormat(totalSeconds) {
	hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	minutes = Math.floor(totalSeconds / 60);
	seconds = totalSeconds % 60;

	minutes = String(minutes).padStart(2, '0');
	hours = String(hours).padStart(2, '0');
	seconds = String(seconds).padStart(2, '0');

	return `${hours}:${minutes}:${seconds}`;
}
async function updatePlayers() {
	var onlinepe = document.getElementById('online-players-count');
	var onlinetbl = document.getElementById('online-table');
	var state = await gamedig.query({
		type: 'garrysmod',
		host: '208.103.169.58',
		maxAttempts: 3
	});
	if (!state) return;
	onlinepe.innerText = `${state.players.length}/${state.maxplayers}`;
	var players = state.players
		.filter((f) => f.name && f.name.length > 1)
		.map((f) => {
			return `<tr> <td>${f.name}</td> <td>${toTimeFormat(Math.ceil(f.time))}</td> </tr>`;
		})
		.join('\n');
	onlinetbl.innerHTML = `<tr> <th>Steam Name</th> <th>Playtime (HH:MM:SS)</th> </tr>` + players;
}

setInterval(updatePlayers, 2500);
