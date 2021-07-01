var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var electron = require('electron');
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

	return hours + ':' + minutes + ':' + seconds;
}

var PlayerList = function (_React$Component) {
	_inherits(PlayerList, _React$Component);

	function PlayerList() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, PlayerList);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PlayerList.__proto__ || Object.getPrototypeOf(PlayerList)).call.apply(_ref, [this].concat(args))), _this), _this.state = { query: { players: [], maxplayers: 0 } }, _this.intervalID = 0, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(PlayerList, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.updatePlayers();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			clearTimeout(this.intervalID);
		}
	}, {
		key: 'updatePlayers',
		value: function updatePlayers() {
			var _this2 = this;

			ipcRenderer.invoke('request-server').then(function (result) {
				gamedig.query({
					type: 'garrysmod',
					host: result.split(":")[0],
					maxAttempts: 3
				}).then(function (state) {
					_this2.setState({ query: state });
					_this2.intervalID = setTimeout(_this2.updatePlayers.bind(_this2), 5000);
				});
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			return React.createElement(
				'div',
				{ id: 'player-holder' },
				React.createElement(
					'h3',
					null,
					'Online Players'
				),
				React.createElement(
					'div',
					null,
					React.createElement(
						'p',
						{ id: 'online-players' },
						'Current Online Players: ',
						this.state.query.players.length,
						'/',
						this.state.query.maxplayers
					)
				),
				React.createElement(
					'h3',
					{ style: { textAlign: 'center', marginBottom: '10px' } },
					'Player List'
				),
				React.createElement(
					Button,
					{
						variant: 'contained',
						color: 'primary',
						onClick: function onClick() {
							clipboard.writeText(_this3.state.query.players.filter(function (f) {
								return f.name && f.name.length > 1;
							}).filter(function (f) {
								return f.time < 86400;
							}).map(function (f) {
								return f.name + ' | ' + toTimeFormat(Math.ceil(f.time));
							}).join('\n'));
						}
					},
					'Copy Players to Clipboard'
				),
				React.createElement(
					'div',
					{ id: 'online-table-container' },
					React.createElement(
						'table',
						{ id: 'online-table' },
						React.createElement(
							'thead',
							null,
							React.createElement(
								'tr',
								null,
								React.createElement(
									'th',
									null,
									'Steam Name'
								),
								React.createElement(
									'th',
									null,
									'Playtime (HH:MM:SS)'
								)
							)
						),
						React.createElement(
							'tbody',
							null,
							this.state.query.players.filter(function (f) {
								return f.name && f.name.length > 1;
							}).filter(function (f) {
								return f.time < 86400;
							}).map(function (f) {
								return React.createElement(
									'tr',
									{ key: '' + f.name },
									React.createElement(
										'th',
										{ key: f.name + '.named' },
										f.name
									),
									React.createElement(
										'th',
										{ key: f.name + '.time' },
										toTimeFormat(Math.ceil(f.time))
									)
								);
							})
						)
					)
				)
			);
		}
	}]);

	return PlayerList;
}(React.Component);

ReactDOM.render(React.createElement(PlayerList, null), document.getElementById('root'));