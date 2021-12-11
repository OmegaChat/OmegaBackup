export default (props) => {
	return (
		<main>
			<div className="center">
				<div className="welcome-container">
					<div className="welcome-title">Moin leude</div>
					<div className="welcome-section">
						<div className="welcome-button-container">
							<a href="/download">
								<button className="welcome-button">Download</button>
							</a>
						</div>
					</div>
					<div className="welcome-section">
						<div className="welcome-button-container">
							<a href="/plans">
								<button className="welcome-button">Plans</button>
							</a>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};
