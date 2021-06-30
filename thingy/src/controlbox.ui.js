const { ipcRenderer } = require('electron');
class ControlBox extends React.Component {
	constructor() {
		super();
	}
	render() {
		return (
			<div id="header-control">
				<button className="controlBttn" onClick={() => ipcRenderer.invoke('controlbox-action', 'minimize')}>
					_
				</button>
				<button className="controlBttn close" onClick={() => ipcRenderer.invoke('controlbox-action', 'close')}>
					x
				</button>
			</div>
		);
	}
}
window.addEventListener('load', function() {
	ReactDOM.render(<ControlBox />, document.getElementById('controlbox-root'));
});