import axios from "axios";
import { Buffer } from "buffer";

export default (
	pathName: string,
	type: String,
	data: Buffer,
	token: string
) => {
	axios
		.post(
			process.argv[4] + "/v1/file/upload",
			{
				path: pathName,
				type: type,
				data: data.toString("base64"),
			},
			{ headers: { auth: token } }
		)
		.catch((err) => {
			console.log("Error while uploading document:", err.response);
		});
};
