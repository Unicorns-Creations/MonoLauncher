class NavBar extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<div id="header-components">
				<img
					id="MonolithLogo"
					src="imgs/logo.png"
					alt="Monolith Logo"
					style={{ width: '215px', height: '36px' }}
				/>
				<div id="navbar">
					<button className="navbutton" onClick={() => window.location.href="launcher.html"}>
						Home
					</button>
					<button className="navbutton" onClick={() => window.location.href="players.html"}>
						Status
					</button>
					<button className="navbutton" onClick={() => window.location.href="Menu.html"}>
						Menu
					</button>
					<button className="navbutton" onClick={() => window.location.href="settings.html"}>
						Settings
					</button>					
				</div>
			</div>
		);
	}
}
ReactDOM.render(<NavBar />, document.getElementById('header-root'));
