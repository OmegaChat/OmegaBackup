import "./App.css";
import "./assets/scss/files/layout.scss";
import "./assets/js/appearence";
import darkIcon from "./assets/media/darkmode.svg";
import lightIcon from "./assets/media/lightmode.svg";
import Default from "./template/default";
import Welcome from "./template/view/welcome";
import Download from "./template/view/download";
import Signin from "./template/view/signin";
import Signup from "./template/view/SignUp.tsx";
import Plans from "./template/view/plans";
import FileExplorer from "./template/view/fileexplorer.tsx";
import Look from "./template/view/look";

function App(props) {
	return (
		<div className="App" data-appearance="" data-plan="1">
			<Default />
			{getView(props)}
		</div>
	);
}

function getView(props) {
	switch (props.view) {
		case "signin": {
			return <Signin></Signin>;
		}
		case "signup": {
			return <Signup></Signup>;
		}
		case "download": {
			return <Download></Download>;
		}
		case "plans": {
			return <Plans></Plans>;
		}
		case "app": {
			return <FileExplorer></FileExplorer>;
		}
		case "look": {
		default: {
			return <Look/>;
		}
	}
}

export default App;
