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
					<button className="navbutton" onClick={() => window.location.href="dev.html"}>
						Dev
					</button>
					<button className="navbutton" onClick={() => window.location.href="players.html"}>
						Players
					</button>
					<button className="navbutton" onClick={() => window.location.href="tools.html"}>
						Tools
					</button>
				</div>
			</div>
		);
	}
}
ReactDOM.render(<NavBar />, document.getElementById('header-root'));
