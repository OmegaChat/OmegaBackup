import darkIcon from "../assets/media/darkmode.svg";
import lightIcon from "../assets/media/lightmode.svg";
import logoWhite from "../assets/media/logowhite.svg";

const def = (props) => {
	return (
		<header>
			<div className="placeholder"></div>
			<a href="/">
				<div className="logo">
					<img className="logo__logo" alt="logo" src={logoWhite}></img>
				</div>
			</a>
			<nav>
				<ul>
					<li>
						<a href="/welcome">Home</a>
					</li>
					<li>
						<a href="/plans">Plans</a>
					</li>
					<li>
						<a href="/download">Download</a>
					</li>
				</ul>
			</nav>
			<div className="appearence-switch" style={{ display: props.plan }}>
				<span className="appearance-icon-light appearance-icon">
					<img src={lightIcon} />
				</span>
				<span className="appearance-icon-dark appearance-icon">
					<img src={darkIcon} />
				</span>
			</div>
		</header>
	);
};

export default def;
