window.addEventListener('load', function () {
	var Button = MaterialUI.Button;
	var element = React.createElement(
		"div",
		null,
		React.createElement(
			Button,
			{ color: "primary", variant: "contained" },
			"Launch Monolith"
		)
	);
	ReactDOM.render(element, document.getElementById('launch-mono-root'));
});