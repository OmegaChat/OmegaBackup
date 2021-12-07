import axios from "axios";

export default (
	pathName: string,
	type: String,
	data: string,
	token: string
) => {
	axios
		.post(
			"http://localhost:3000/v1/file/upload",
			{ path: pathName, type: type, data: data },
			{ headers: { auth: token } }
		)
		.catch((err) => {
			console.log("Error while uploading document:", err.response);
		});
};
