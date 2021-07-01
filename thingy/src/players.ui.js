const electron = require('electron');
var clipboard = electron.clipboard;
var ipcRenderer = electron.ipcRenderer;
var gamedig = require('gamedig');
var Button = MaterialUI.Button;
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
class PlayerList extends React.Component {
	state = { query: { players: [], maxplayers: 0 } };
	intervalID = 0;
	componentDidMount() {
		this.updatePlayers();
	}

	componentWillUnmount() {
		clearTimeout(this.intervalID);
	}

	updatePlayers() {
		ipcRenderer.invoke('request-server').then((result) => {
			gamedig
				.query({
					type: 'garrysmod',
					host: result.split(":")[0],
					maxAttempts: 3
				})
				.then((state) => {
					this.setState({ query: state });
					this.intervalID = setTimeout(this.updatePlayers.bind(this), 5000);
				});
		});
	}
	render() {
		return (
			<div id="player-holder">
				<h3>Online Players</h3>
				<div>
					<p id="online-players">
						Current Online Players: {this.state.query.players.length}/{this.state.query.maxplayers}
					</p>
				</div>
				<h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Player List</h3>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						clipboard.writeText(
							this.state.query.players
								.filter((f) => f.name && f.name.length > 1)
								.filter((f) => f.time < 86400)
								.map((f) => `${f.name} | ${toTimeFormat(Math.ceil(f.time))}`)
								.join('\n')
						);
					}}
				>
					Copy Players to Clipboard
				</Button>
				<div id="online-table-container">
					<table id="online-table">
						<thead>
							<tr>
								<th>Steam Name</th>
								<th>Playtime (HH:MM:SS)</th>
							</tr>
						</thead>
						<tbody>
							{this.state.query.players
								.filter((f) => f.name && f.name.length > 1)
								.filter((f) => f.time < 86400)
								.map((f) => {
									return (
										<tr key={`${f.name}`}>
											<th key={`${f.name}.named`}>{f.name}</th>
											<th key={`${f.name}.time`}>{toTimeFormat(Math.ceil(f.time))}</th>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
ReactDOM.render(<PlayerList />, document.getElementById('root'));
