var gamedig = require('gamedig');
var ms = require('ms');
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
	var players = state.players.filter((f) => f.name && f.name.length > 1).map((f) => {
		return `<tr> <td>${f.name}</td> <td>${ms(f.time * 1000, { long: true })}</td> </tr>`;
	}).join("\n")
	onlinetbl.innerHTML = `<tr> <th>Steam Name</th> <th>Playtime</th> </tr>` + players;
}

setInterval(updatePlayers, 2500);
