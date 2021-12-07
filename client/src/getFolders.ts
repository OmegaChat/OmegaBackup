import fs from "fs";

export interface foldersOrFiles {
	isFile: boolean;
	pathName: string;
	children?: foldersOrFiles[];
}

export const getFolders = (
	path: string
): Promise<{ isFile: boolean; pathName: string }[]> => {
	const foldersAndFiles: foldersOrFiles[] = [];
	let done = 0;

	return new Promise((res) => {
		fs.readdir(path, {}, (_, files) => {
			if (files && files.length) {
				files.forEach((file) => {
					if (file !== ".omega-hashes.json") {
						fs.stat(path + "/" + file, {}, (_, stats) => {
							if (stats) {
								if (stats.isFile()) {
									foldersAndFiles.push({
										isFile: true,
										pathName: path + "/" + file,
									});
									done++;
									if (done === files.length) {
										res(foldersAndFiles);
									}
								} else {
									getFolders(path + "/" + file).then((folders) => {
										foldersAndFiles.push({
											isFile: false,
											pathName: path + "/" + file,
											children: folders,
										});
										done++;
										if (done === files.length) {
											res(foldersAndFiles);
										}
									});
								}
							} else {
								done += 1;
								if (done === files.length) {
									res(foldersAndFiles);
								}
							}
						});
					} else {
						done += 1;
						if (done === files.length) {
							res(foldersAndFiles);
						}
					}
				});
			} else {
				res([]);
			}
		});
	});
};

// eeeeeeee
