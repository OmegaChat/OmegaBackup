import { useState } from "react";
import backend from "../shared/url";

const SignUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [userName, setUserName] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	return (
		<main>
			<div className="center">
				<div className="sign-container">
					<div className="sign-title">OMEGA-GROUP</div>
					<form>
						<div className="email">
							<input
								type="text"
								id="emailInput"
								placeholder="Enter Email"
								onChange={({ target: { value } }) => setEmail(value)}
							/>
							<label htmlFor="emailInput">Email</label>
						</div>
						<div className="username">
							<input
								type="text"
								id="usernameInput"
								placeholder="Enter Username"
								onChange={({ target: { value } }) => setUserName(value)}
							/>
							<label htmlFor="usernameInput">Username</label>
						</div>
						<div className="password">
							<input
								type="password"
								id="passwordInput"
								placeholder="Enter Password"
								onChange={({ target: { value } }) => setPassword(value)}
							/>
							<label htmlFor="passwordInput">Password</label>
						</div>
						<div className="passwordRepeat">
							<input
								type="password"
								id="passwordInputRepeat"
								placeholder="Repeat your Password"
								onChange={({ target: { value } }) => setConfirmPassword(value)}
							/>
							<label htmlFor="passwordInputRepeat">Password</label>
						</div>
						<p className="errorMessage">{errorMessage}</p>
						<div className="submit">
							<input
								type="submit"
								id="submit"
								value="Submit"
								style={
									email && password && userName && password === confirmPassword
										? { opacity: "100%", cursor: "pointer" }
										: { opacity: "40%", cursor: "not-allowed" }
								}
								onClick={(e) => {
									e.preventDefault();
									if (
										email &&
										password &&
										userName &&
										password === confirmPassword
									) {
										setErrorMessage("");
										fetch(backend + "/v1/user/regin", {
											method: "POST",
											headers: {
												"Content-Type": "application/json",
											},
											credentials: "include",
											body: JSON.stringify({
												email,
												password,
												name: userName,
											}),
										}).then((r) => {
											r.json().then((data) => {
												if (!data.ok) {
													setErrorMessage(data.error);
												} else {
													window.location.href = "/app";
												}
											});
										});
									}
								}}
							/>
						</div>
					</form>
				</div>
			</div>
		</main>
	);
};

export default SignUp;
