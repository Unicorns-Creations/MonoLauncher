window.addEventListener('load', function() {
	var Button = MaterialUI.Button;
	const element = (
		<div>
			<Button color="primary" variant="contained">
				Launch Monolith
			</Button>
		</div>
	);
	ReactDOM.render(element, document.getElementById('launch-mono-root'));
});
