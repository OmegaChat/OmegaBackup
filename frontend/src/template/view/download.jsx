import mac from "../../assets/downloads/omegabackup_mac.zip";
import windows from "../../assets/downloads/bundle.zip";
import linux from "../../assets/downloads/omegabackup_unix.zip";

function getOS() {
	console.log(navigator.userAgent);
	if (navigator.userAgent.indexOf("Mac") > -1) {
		return windows;
	} else if (navigator.userAgent.indexOf("Linux") > -1) {
		return windows;
	} else if (navigator.userAgent.indexOf("Windows") > -1) {
		return windows;
	} else {
		console.log("failed to detect OS");
		return windows;
	}
}

export default (props) => {
	return (
		<main>
			<div className="center">
				<div className="download-container">
					<p className="download-title">Omegabackup Version Alpha</p>
					<a href={getOS()}>
						<button className="download-button">Download</button>
					</a>
				</div>
			</div>
		</main>
	);
};
