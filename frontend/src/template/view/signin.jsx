import { useState } from "react";
import backend from "../shared/url";

const SignIn = (props, media) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
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
						<div className="password">
							<input
								type="password"
								id="passwordInput"
								placeholder="Enter Password"
								onChange={({ target: { value } }) => setPassword(value)}
							/>
							<label htmlFor="passwordInput">Password</label>
						</div>
						<p className="errorMessage">{error}</p>
						<div className="submit">
							<input
								type="submit"
								id="submit"
								value="Log In"
								style={
									email && password
										? { curor: "pointer", opacity: "100%" }
										: { cursor: "not-allowed", opacity: "40%" }
								}
								onClick={(e) => {
									e.preventDefault();
									setError("");
									fetch(backend + "/v1/user/regin", {
										method: "POST",
										credentials: "include",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify({
											name: email,
											password,
										}),
									}).then((res) =>
										res.json().then((data) => {
											if (data.ok) {
												window.location.href = "/app";
											} else {
												setError(data.error);
											}
										})
									);
								}}
							/>
						</div>
					</form>
				</div>
			</div>
		</main>
	);
};

export default SignIn;
