const { ipcRenderer } = require('electron');
/*
this.setState({ query: state });
this.intervalID = setTimeout(this.updatePlayers.bind(this), 5000);
*/
class RamDisplay extends React.Component {
	state = { ram: { amount: '0/0GB' } };
	intervalID = 0;
	componentDidMount() {
		this.updateRam();
	}

	componentWillUnmount() {
		clearTimeout(this.intervalID);
	}

	updateRam() {
		ipcRenderer.invoke('request-ram').then((result) => {
			this.setState({ ram: {amount: result} });
			this.intervalID = setTimeout(this.updateRam.bind(this), 500);
		});
	}
	render() {
		return (
			<div>
				<h3>Ram Usage</h3>
				<p>Current Ram Usage: {this.state.ram.amount}</p>
			</div>
		);
	}
}

class DiscordDisplay extends React.Component {
	state = { discord: { username: 'Username#0000' } };
	intervalID = 0;
	componentDidMount() {
		this.updateDiscord();
	}

	componentWillUnmount() {
		clearTimeout(this.intervalID);
	}

	updateDiscord() {
        ipcRenderer.invoke('request-discord').then((result) => {
			this.setState({ discord: {username: result} });
			this.intervalID = setTimeout(this.updateDiscord.bind(this), 500);
		});
    }

	render() {
		return (
			<div id="discord-container">
				<h3>Discord User</h3>
				<p id="discord-holder">Logged in as: {this.state.discord.username}</p>
			</div>
		);
	}
}

ReactDOM.render(
	<div>
		<RamDisplay />
		<br />
		<DiscordDisplay />
	</div>,
	document.getElementById('root')
);
