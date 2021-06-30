var _require = require('electron'),
    ipcRenderer = _require.ipcRenderer;

function launchMonolith() {
	ipcRenderer.send('game-launch');
}
function joinDiscord() {
	ipcRenderer.send('join-discord');
}
window.addEventListener('load', function () {
	var Button = MaterialUI.Button;
	var element = React.createElement(
		'div',
		null,
		React.createElement(
			Button,
			{ color: 'primary', variant: 'contained', onClick: function onClick() {
					return launchMonolith();
				} },
			'Launch Monolith'
		)
	);
	// ReactDOM.render(element, document.getElementById('launch-mono-root'));
});