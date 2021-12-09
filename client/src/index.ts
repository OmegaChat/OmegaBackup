import axios from "axios";
import runBackup, { loadFileVersions } from "./runBackup";
let token = "";

axios
	.post("http://localhost:3000/v1/user/regin", {
		name: process.argv[2],
		password: process.argv[3],
	})
	.then((res) => {
		if (res.status === 200 && res.data.ok) {
			token = res.data.result.token;
			loadFileVersions((versions: any) => {
				setInterval(() => {
					runBackup(token, versions);
				}, 1000);
			});
		} else {
			console.log("Failed to log in. Error:", res.data);
		}
	})
	.catch((err) => {
		console.log("Failed to log in. Error:", err.response.data);
	});
