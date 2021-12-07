import { readFile, writeFile } from "fs";
import path from "path";

export default (): Promise<any> => {
	return new Promise((res) => {
		readFile(path.join(__dirname, ".omega-hashes.json"), (err, data) => {
			if (err) {
				res({});
			} else {
				res(JSON.parse(data.toString()));
			}
		});
	});
};

export const writeFileVersions = (versions: any): void => {
	writeFile(
		path.join(__dirname, ".omega-hashes.json"),
		JSON.stringify(versions),
		() => {}
	);
};
