const { ipcRenderer } = require('electron');
function launchMonolith() {
	ipcRenderer.send('game-launch');
}
function joinDiscord() {
	ipcRenderer.send('join-discord');
}
window.addEventListener('load', function() {
	var Button = MaterialUI.Button;
	const element = (
		<div>
			<Button color="primary" variant="contained" onClick={() => launchMonolith()} >
				Launch Monolith
			</Button>
		</div>
	);
	ReactDOM.render(element, document.getElementById('launch-mono-root'));
});
