import "../../assets/scss/files/look.scss";
import logoWhite from "../../assets/media/logowhite.svg";
import logo from "../../assets/media/logo.svg";
import { useEffect, useState } from "react";
import backend from "../shared/url";

const Look = () => {
	useEffect(() => {
		fetch(backend + "/v1/user/loginStatus", {
			credentials: "include",
		}).then((d) => {
			setLoggedIn(d.status === 200);
		});
	}, []);
	const [loggedIn, setLoggedIn] = useState(false);
	return (
		<main>
			<div className="look">
				<div className="look__logo look__logo__white">
					<img src={logoWhite} alt="logo" />
				</div>
				<div className="look__logo look__logo__black">
					<img src={logo} alt="logo" />
				</div>
				<h1 className="look__title">Welcome to OmegaBackup</h1>
				<p className="look__todo">
					{loggedIn
						? "You just created an account on the best Backup Platform on earth."
						: "You are not currently logged in."}
					<br />
					<br />
					{loggedIn ? "Start by " : "Sign Up using "}
					<a className="todo__link" href={loggedIn ? "/download" : "/signup"}>
						{loggedIn ? "downloading our client" : "this link"}
					</a>
					{loggedIn ? " or proceed to " : " or log in "}
					<a className="todo__link" href={loggedIn ? "/app" : "/signin"}>
						{loggedIn ? " view your backups" : "using this link."}
					</a>
				</p>
				<div className="look__buttons">
					<a className="buttons__link" href={loggedIn ? "/download" : "/signup"}>
						<button className="buttons__button">
							{loggedIn ? "Download Client" : "Sign Up"}
						</button>
					</a>
					<a className="buttons__link" href={loggedIn ? "/app" : "/signin"}>
						<button className="buttons__button">
							{loggedIn ? "View Backups" : "Sign In"}
						</button>
					</a>
				</div>
			</div>
		</main>
	);
};

export default Look;
