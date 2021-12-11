import fs from "fs";

export const getFolders = (path: string): Promise<string[]> => {
	const folders: string[] = [];
	let done = 0;
	return new Promise((res) => {
		fs.readdir(path, {}, (_, files) => {
			if (files && files.length) {
				files.forEach((file) => {
					fs.stat(path + file, {}, (_, stats) => {
						if (stats) {
							if (!stats.isFile()) {
								folders.push(file.toString());
							}
							done += 1;
							if (done === files.length) {
								res(folders);
							}
						} else {
							done += 1;
							if (done === files.length) {
								res(folders);
							}
						}
					});
				});
			} else {
				res([]);
			}
		});
	});
};
export const getFiles = (path: string): Promise<string[]> => {
	const files: string[] = [];
	let done = 0;
	return new Promise((res) => {
		fs.readdir(path, {}, (_, foundFiles) => {
			if (foundFiles && foundFiles.length > 0) {
				foundFiles.forEach((file) => {
					fs.stat(path + file, {}, (_, stats) => {
						if (stats) {
							if (stats.isFile()) {
								files.push(file.toString());
							}
							done += 1;
							if (done === foundFiles.length) {
								res(files);
							}
						} else {
							done += 1;
							if (done === foundFiles.length) {
								res(files);
							}
						}
					});
				});
			} else {
				res([]);
			}
		});
	});
};

export const getItems = (
	path: string
): Promise<{ path: string; isFile: boolean }[]> => {
	const items: { path: string; isFile: boolean }[] = [];
	let done = 0;
	return new Promise((res) => {
		fs.readdir(path, {}, (_, foundFiles) => {
			if (foundFiles && foundFiles.length > 0) {
				foundFiles.forEach((file) => {
					fs.stat(path + file, {}, (_, stats) => {
						if (stats) {
							items.push({ path: file.toString(), isFile: stats.isFile() });
							done += 1;
							if (done === foundFiles.length) {
								res(items);
							}
						} else {
							done += 1;
							if (done === foundFiles.length) {
								res(items);
							}
						}
					});
				});
			} else {
				res([]);
			}
		});
	});
};

export const getVolumes = (): Promise<string[]> => {
	return getFolders(
		process.platform === "darwin"
			? "/Volumes/"
			: "/media/" + process.env.USER + "/"
	);
};
