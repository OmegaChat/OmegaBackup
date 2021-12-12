import "../../assets/scss/files/look.scss";
import logoWhite from "../../assets/media/logowhite.svg";

const Look = () => {
	return (
		<div className="look">
			<div className="look__logo">
				<img src={logoWhite} alt="logo" />
			</div>
			<h1 className="look__title">Welcome to OmegaBackup</h1>
			<p className="look__todo">
				You just created an account on the best Backup Platform on earth.
				<br />
				<br />
				Start by{" "}
				<a className="todo__link" href="/download">
					downloading our client{" "}
				</a>
				or proceed to
				<a className="todo__link" href="/app">
					{" "}
					view your backups
				</a>
				.
			</p>
			<div className="look__buttons">
				<a className="buttons__link" href="/download">
					<button className="buttons__button">Download Client</button>
				</a>
				<a className="buttons__link" href="/app">
					<button className="buttons__button">View Backups</button>
				</a>
			</div>
		</div>
	);
};

export default Look;
