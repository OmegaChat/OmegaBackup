import { getFolders, foldersOrFiles } from "./getFolders";
import readFileVersions, { writeFileVersions } from "./readFileVersions";
import { createHash } from "crypto";
import { createReadStream, readFile } from "fs";
import { getType } from "mime";
import uploadFile from "./uploadFile";

export const loadFileVersions = (callback: Function) => {
	readFileVersions().then((versions) => {
		versions = versions;
		callback(versions);
	});
};

export const checkFolder = (
	items: foldersOrFiles,
	versions: any,
	token: string
): void => {
	if (items.isFile) {
		const hash = createHash("md5");
		readFile(items.pathName, (err, data) => {
			if (err) {
				console.log(err);
			}
			hash.update(data);
			const fileHash = hash.digest("hex");
			if (fileHash !== versions[items.pathName]) {
				versions[items.pathName] = fileHash;
				const type = getType(items.pathName);
				const readStream = createReadStream(items.pathName);
				const blobs: Buffer[] = [];
				readStream.on("data", (chunk) => {
					blobs.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
				});
				readStream.on("end", () => {
					uploadFile(
						items.pathName,
						type ? type : "text/plain",
						Buffer.concat(blobs),
						token
					);
				});
				readStream.on("end", () => {});
				console.log(`${items.pathName} has been changed`);
			}
		});
	} else if (items.children) {
		items.children.forEach((item) => {
			checkFolder(item, versions, token);
		});
	}
};

export default (token: string, versions: any) => {
	getFolders(__dirname).then((folders) => {
		folders.forEach((folder) => {
			checkFolder(folder, versions, token);
		});
	});
	writeFileVersions(versions);
};
