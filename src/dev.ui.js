var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('electron'),
    ipcRenderer = _require.ipcRenderer;
/*
this.setState({ query: state });
this.intervalID = setTimeout(this.updatePlayers.bind(this), 5000);
*/


var RamDisplay = function (_React$Component) {
	_inherits(RamDisplay, _React$Component);

	function RamDisplay() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, RamDisplay);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RamDisplay.__proto__ || Object.getPrototypeOf(RamDisplay)).call.apply(_ref, [this].concat(args))), _this), _this.state = { ram: { amount: '0/0GB' } }, _this.intervalID = 0, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(RamDisplay, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.updateRam();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			clearTimeout(this.intervalID);
		}
	}, {
		key: 'updateRam',
		value: function updateRam() {
			var _this2 = this;

			ipcRenderer.invoke('request-ram').then(function (result) {
				_this2.setState({ ram: { amount: result } });
				_this2.intervalID = setTimeout(_this2.updateRam.bind(_this2), 500);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				React.createElement(
					'h3',
					null,
					'Ram Usage'
				),
				React.createElement(
					'p',
					null,
					'Current Ram Usage: ',
					this.state.ram.amount
				)
			);
		}
	}]);

	return RamDisplay;
}(React.Component);

var DiscordDisplay = function (_React$Component2) {
	_inherits(DiscordDisplay, _React$Component2);

	function DiscordDisplay() {
		var _ref2;

		var _temp2, _this3, _ret2;

		_classCallCheck(this, DiscordDisplay);

		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		return _ret2 = (_temp2 = (_this3 = _possibleConstructorReturn(this, (_ref2 = DiscordDisplay.__proto__ || Object.getPrototypeOf(DiscordDisplay)).call.apply(_ref2, [this].concat(args))), _this3), _this3.state = { discord: { username: 'Username#0000' } }, _this3.intervalID = 0, _temp2), _possibleConstructorReturn(_this3, _ret2);
	}

	_createClass(DiscordDisplay, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.updateDiscord();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			clearTimeout(this.intervalID);
		}
	}, {
		key: 'updateDiscord',
		value: function updateDiscord() {
			var _this4 = this;

			ipcRenderer.invoke('request-discord').then(function (result) {
				_this4.setState({ discord: { username: result } });
				_this4.intervalID = setTimeout(_this4.updateDiscord.bind(_this4), 500);
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ id: 'discord-container' },
				React.createElement(
					'h3',
					null,
					'Discord User'
				),
				React.createElement(
					'p',
					{ id: 'discord-holder' },
					'Logged in as: ',
					this.state.discord.username
				)
			);
		}
	}]);

	return DiscordDisplay;
}(React.Component);

ReactDOM.render(React.createElement(
	'div',
	null,
	React.createElement(RamDisplay, null),
	React.createElement('br', null),
	React.createElement(DiscordDisplay, null)
), document.getElementById('root'));