<<<<<<< Updated upstream
import "./App.css";
import "./assets/scss/files/layout.scss";
import "./assets/scss/base.scss";
// import "./assets/scss/files/layout.scss";
import "./assets/js/appearence";
=======
// import "./App.css";
>>>>>>> Stashed changes
import darkIcon from "./assets/media/darkmode.svg";
import lightIcon from "./assets/media/lightmode.svg";
import Default from "./template/default";
import Welcome from "./template/view/welcome";
import Download from "./template/view/download";
import Signin from "./template/view/signin";
import Signup from "./template/view/signup";
import Plans from "./template/view/plans";

function App(props) {
	return (
<<<<<<< Updated upstream
		<div className="App" data-appearance="" data-appearance-invertet="false">
			<Default></Default>
			{props.view.map((e) => {
				// return <Default media={[darkIcon, lightIcon]}></Default>;
				return <Plans></Plans>;
			})}
=======
		<div className="App" data-appearance="" data-plan="1">
			<Default/>
			{
				getView(props)
			}
>>>>>>> Stashed changes
		</div>
	);
}

function getView(props) {
	switch(props.view) {
		case 'signin' : {
			return <Signin></Signin>;
			break;
		}
		case 'signup' : {
			return <Signup></Signup>;
			break;
		}
		case 'download' : {
			return <Download></Download>;
			break;
		}
		case 'plans' : {
			return <Plans></Plans>;
			break;
		}
		default : {
			return <Welcome></Welcome>;
			break;
		}

	}
}

export default App;
