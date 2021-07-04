var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NavBar = function (_React$Component) {
	_inherits(NavBar, _React$Component);

	function NavBar() {
		_classCallCheck(this, NavBar);

		return _possibleConstructorReturn(this, (NavBar.__proto__ || Object.getPrototypeOf(NavBar)).call(this));
	}

	_createClass(NavBar, [{
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				{ id: "header-components" },
				React.createElement("img", {
					id: "MonolithLogo",
					src: "imgs/logo.png",
					alt: "Monolith Logo",
					style: { width: '215px', height: '36px' }
				}),
				React.createElement(
					"div",
					{ id: "navbar" },
					React.createElement(
						"button",
						{ className: "navbutton", onClick: function onClick() {
								return window.location.href = "launcher.html";
							} },
						"Home"
					),
					React.createElement(
						"button",
						{ className: "navbutton", onClick: function onClick() {
								return window.location.href = "players.html";
							} },
						"Status"
					),
					React.createElement(
						"button",
						{ className: "navbutton", onClick: function onClick() {
								return window.location.href = "Menu.html";
							} },
						"Menu"
					),
					React.createElement(
						"button",
						{ className: "navbutton", onClick: function onClick() {
								return window.location.href = "settings.html";
							} },
						"Settings"
					)
				)
			);
		}
	}]);

	return NavBar;
}(React.Component);

ReactDOM.render(React.createElement(NavBar, null), document.getElementById('header-root'));