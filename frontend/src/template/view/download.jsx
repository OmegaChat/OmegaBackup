import mac from "../../assets/downloads/omegabackup_mac";
import windows from "../../assets/downloads/omegabackup.exe";
import linux from "../../assets/downloads/omegabackup_unix";

function getOS() {
	console.log(navigator.userAgent);
	if (navigator.userAgent.indexOf("Mac") > -1) {
		return mac;
	} else if (navigator.userAgent.indexOf("Linux") > -1) {
		return linux;
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
