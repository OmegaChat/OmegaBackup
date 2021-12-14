import axios from "axios";
import { Buffer } from "buffer";

const replaceAll = (str: string, find: string, target: string) => {
	return str.split(find).join(target); 
};

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
				path: replaceAll(pathName, "\\", "/"),
				type: type,
				data: data.toString("base64"),
			},
			{ headers: { auth: token } }
		)
		.catch((err) => {
			console.log("Error while uploading document:", err.response);
		});
};
