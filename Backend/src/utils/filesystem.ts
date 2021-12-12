import fs from "fs";
import { getVolumes, getFiles, getFolders } from "./getVolumes";

const allowedCharacterRegex = /[A-Za-z]+/g;

export const makeSlashPath = (path: string) =>
	(path[0] === "/" ? "" : "/") +
	replaceAll(replaceAll(path, "../", ""), "..", "");
// const makePath = (path: string) => {
// 	while (path[0] === "/") {
// 		path = path.substr(1);
// 	}
// 	return replaceAll(path, "..", "");
// };
const replaceAll = (str: string, find: string, replace: string) => {
	return str.split(find).join(replace);
};

// the below code determines the volumes (mac) folder (or media on linux)
const buildPath = (volume: string, path: string) =>
	(process.platform === "darwin" ? "/Volumes" : "/media/" + process.env.USER) +
	"/" +
	volume +
	"/" +
	replaceAll(replaceAll(path, "../", ""), "..", "");

const genUserFolder = (id: string, name: string) => {
	const matches = name.match(allowedCharacterRegex);
	if (matches && matches.length) {
		return id + "_" + matches.join("-");
	} else {
		return id + "_";
	}
};

class FileSystem {
	private operationalDrives: string[] = [];
	private primaryDrives: string[] = [];
	private blockedDrives: string[] = [];
	private optimalDriveArray: string[] = [];
	private getRandomDrive(): string {
		return this.optimalDriveArray[
			Math.floor(Math.random() * this.optimalDriveArray.length)
		];
	}
	private cloneFolder(source: string, target: string, path: string) {
		getFolders(buildPath(source, path + "/")).then((folders) => {
			folders.forEach((folder) => {
				fs.mkdir(buildPath(target, path + "/" + folder + "/"), (err) => {
					if (err) {
						console.log(err);
					} else {
						this.cloneFolder(source, target, path + "/" + folder);
					}
				});
			});
		});
		getFiles(buildPath(source, path + "/")).then((files) => {
			files.forEach((file) => {
				fs.readFile(buildPath(source, path + "/" + file), (err, data) => {
					if (err) {
						console.log(err);
					}
					fs.writeFile(buildPath(target, path + "/" + file), data, (err) => {
						if (err) {
							console.log(err);
						}
					});
				});
			});
		});
	}
	public listFolders(
		name: string,
		id: string,
		path: string
	): Promise<{ path: string; isFile: boolean; name: string }[]> {
		return new Promise((res) => {
			console.log(
				buildPath(
					this.getRandomDrive(),
					genUserFolder(id, name) + makeSlashPath(path)
				)
			);
			fs.readdir(
				buildPath(
					this.getRandomDrive(),
					genUserFolder(id, name) + makeSlashPath(path)
				),
				(err, files) => {
					if (err) {
						console.log(err);
						res([]);
					} else if (files.length === 0) {
						res([]);
					} else {
						let done = 0;
						const results: { path: string; isFile: boolean; name: string }[] =
							[];
						files.forEach((file) => {
							if (file[0] === "." || file.indexOf("history-") === 0) {
								if (done === files.length) {
									res(results);
								}
								done++;
							} else {
								fs.stat(
									buildPath(
										this.getRandomDrive(),
										genUserFolder(id, name) + makeSlashPath(path + file)
									),
									(err, stats) => {
										if (err) {
											console.log(err);
										}
										if (stats) {
											results.push({
												path: makeSlashPath(path + file),
												isFile: stats.isFile(),
												name: file,
											});
										}
										done++;
										if (done === files.length) {
											res(results);
										}
									}
								);
							}
						});
					}
				}
			);
		});
	}
	private cloneDrive(target: string) {
		if (this.operationalDrives.includes(target)) {
			getFolders(buildPath(this.getRandomDrive(), "")).then((folders) => {
				folders.forEach((folder) => {
					fs.mkdir(buildPath(target, folder + "/"), (err) => {
						if (err) {
							console.log(err);
						} else {
							this.cloneFolder(this.getRandomDrive(), target, folder);
						}
					});
				});
			});
			this.blockedDrives.push(target);
			this.operationalDrives.splice(this.operationalDrives.indexOf(target), 1);
			setTimeout(
				(() => {
					this.blockedDrives.splice(this.blockedDrives.indexOf(target), 1);
					this.primaryDrives.push(target);
				}).bind(this),
				10000
			);
		} else {
			console.log("tried to clone primary drive or drive was removed");
		}
	}
	private checkDrives(): void {
		console.log(this.primaryDrives, this.operationalDrives);
		const newPrimaryDrives: string[] = [];
		const newOperationalDrives: string[] = [];
		getVolumes().then((volumes) => {
			this.primaryDrives.forEach((drive) => {
				if (volumes.includes(drive)) {
					newPrimaryDrives.push(drive);
				}
			});
			this.operationalDrives.forEach((drive) => {
				if (volumes.includes(drive)) {
					newOperationalDrives.push(drive);
				}
			});
			volumes.forEach((volume) => {
				if (
					!this.primaryDrives.includes(volume) &&
					!this.operationalDrives.includes(volume) &&
					!this.blockedDrives.includes(volume)
				) {
					getFiles(buildPath(volume, "")).then((files) => {
						if (files.includes("omega-allow.txt")) {
							this.operationalDrives.push(volume);
						}
					});
				}
			});
			this.primaryDrives = newPrimaryDrives;
			this.operationalDrives = newOperationalDrives;
			this.pickPrimaryDrive();
		});
	}
	private calculateOptimalDriveArray(): Promise<number> {
		const speeds: { drive: string; speed: number }[] = [];
		return new Promise((res) => {
			this.primaryDrives.forEach((drive) => {
				fs.writeFile(buildPath(drive, ".omega-speedtest"), "run", (err) => {
					if (err) {
						console.log(err);
					}
					const start = new Date();
					fs.readFile(buildPath(drive, ".omega-speedtest"), (err, _) => {
						if (err) {
							console.log(err);
						}
						const end = new Date();
						speeds.push({ drive, speed: end.getTime() - start.getTime() });
						if (speeds.length === this.primaryDrives.length) {
							let total = 0;
							speeds.forEach((speed) => {
								total += speed.speed;
							});
							const average = total / speeds.length;
							const optimalArray: string[] = [];
							speeds.forEach((speed) => {
								let times = Math.round(speed.speed / average);
								if (times > 0) {
									times = 1;
								}
								for (let i = 0; i < times; i++) {
									optimalArray.push(speed.drive);
								}
							});
							this.optimalDriveArray = optimalArray;
						}
						res(end.getTime() - start.getTime());
					});
				});
			});
		});
	}
	private latestDriveBackup: number = 0;
	private getWritableDrives(): string[] {
		return this.primaryDrives.concat(this.operationalDrives);
	}
	private pickPrimaryDrive(): void {
		if (!this.primaryDrives.length) {
			if (this.operationalDrives.length) {
				this.primaryDrives = [this.operationalDrives[0]];
				this.operationalDrives.shift();
			} else {
				console.log("no useable drives found");
				process.exit(1);
			}
		}
		this.calculateOptimalDriveArray();
		this.operationalDrives.forEach((drive) => {
			this.cloneDrive(drive);
		});
		console.log("Primary drives:", this.primaryDrives.join(", "));
	}
	constructor() {
		getVolumes().then((volumes) => {
			let coveredVolumes = 0;
			volumes.forEach((volume) => {
				getFiles(buildPath(volume, "/")).then((files) => {
					if (files && files.length) {
						if (files.includes(".omega_lastbackup")) {
							fs.readFile(
								buildPath(volume, "/.omega_lastbackup"),
								(err, data) => {
									if (err) {
										console.log(err);
									}
									if (data) {
										const timestamp = new Date(data.toString());
										console.log("Using", volume);
										if (timestamp.toString() !== "Invalid Date") {
											if (this.latestDriveBackup === timestamp.getTime()) {
												this.primaryDrives.push(volume);
											} else if (this.latestDriveBackup < timestamp.getTime()) {
												this.latestDriveBackup = timestamp.getTime();
												this.primaryDrives.forEach((drive) => {
													this.operationalDrives.push(drive);
												});
												this.primaryDrives = [volume];
											} else {
												this.operationalDrives.push(volume);
											}
										} else if (files.includes("omega-allow.txt")) {
											this.operationalDrives.push(volume);
										}
										coveredVolumes++;
										if (coveredVolumes === volumes.length) {
											setInterval(this.checkDrives.bind(this), 5000);
											this.pickPrimaryDrive();
										}
									} else {
										getFiles(buildPath(volume, "/")).then((files) => {
											if (files.includes("omega-allow.txt")) {
												this.operationalDrives.push(volume);
											} else {
												console.log(
													"Drive " +
														volume +
														" does not have an omega-allow.txt file, ignoring"
												);
											}
											coveredVolumes++;
											if (coveredVolumes === volumes.length) {
												setInterval(this.checkDrives.bind(this), 5000);
												this.pickPrimaryDrive();
											}
										});
									}
								}
							);
						} else {
							getFiles(buildPath(volume, "/")).then((files) => {
								if (files.includes("omega-allow.txt")) {
									this.operationalDrives.push(volume);
								} else {
									console.log(
										"Drive " +
											volume +
											" does not have an omega-allow.txt file, ignoring"
									);
								}
								coveredVolumes++;
								if (coveredVolumes === volumes.length) {
									setInterval(this.checkDrives.bind(this), 5000);
									this.pickPrimaryDrive();
								}
							});
						}
					} else {
						console.log(
							"Drive " +
								volume +
								" does not have an omega-allow.txt file, ignoring"
						);
						coveredVolumes++;
						if (coveredVolumes === volumes.length) {
							this.pickPrimaryDrive();
						}
					}
				});
			});
		});
	}
	private updateLastBackup(drive: string): void {
		const now = new Date().toString();
		if (this.primaryDrives.includes(drive)) {
			fs.writeFile(buildPath(drive, "/.omega_lastbackup"), now, (err) => {
				if (err) {
					console.log(err);
				}
			});
		}
	}
	private createFolder(path: string): Promise<boolean> {
		return new Promise((res) => {
			this.getWritableDrives().forEach((drive) => {
				fs.mkdir(buildPath(drive, path), (err) => {
					if (err) {
						res(false);
						this.checkDrives();
						console.log(err);
					} else {
						res(true);
					}
					this.updateLastBackup(drive);
				});
			});
		});
	}
	public writeUserFile(
		id: string,
		name: string,
		path: string,
		data: string | Buffer
	): void {
		this.generateFolderPath(
			genUserFolder(id, name) + makeSlashPath(path),
			() => {
				this.writeFile(genUserFolder(id, name) + makeSlashPath(path), data);
			}
		);
	}
	private writeFile(path: string, data: string | Buffer): Promise<boolean> {
		return new Promise((res) => {
			this.getWritableDrives().forEach((drive) => {
				fs.writeFile(buildPath(drive, path), data, (err) => {
					if (err) {
						console.log(err);
						this.checkDrives();
						res(false);
					} else {
						res(true);
					}
					this.updateLastBackup(drive);
				});
			});
		});
	}
	private createFolderPathRecursively(
		initialPath: string,
		parts: string[],
		rapidCreate: boolean,
		callback: () => void
	): void {
		if (parts.length) {
			const addElement = parts[0];
			if (rapidCreate) {
				this.createFolder(initialPath + addElement).then(() => {
					parts.shift();
					this.createFolderPathRecursively(
						initialPath + addElement + "/",
						parts,
						rapidCreate,
						callback
					);
				});
			} else {
				getFolders(buildPath(this.getRandomDrive(), initialPath)).then(
					(folders) => {
						if (folders.includes(parts[0])) {
							parts.shift();
							this.createFolderPathRecursively(
								initialPath + addElement + "/",
								parts,
								rapidCreate,
								callback
							);
						} else {
							this.createFolder(initialPath + addElement).then(() => {
								parts.shift();
								this.createFolderPathRecursively(
									initialPath + addElement + "/",
									parts,
									true,
									callback
								);
							});
						}
					}
				);
			}
		} else {
			setTimeout(() => {
				callback();
			}, 200);
		}
	}
	private moveFile(
		source: string,
		destination: string,
		callback: () => void
	): void {
		this.getWritableDrives().forEach((drive) => {
			fs.rename(
				buildPath(drive, source),
				buildPath(drive, destination),
				(err) => {
					if (err) {
						console.log(err);
					}
					this.updateLastBackup(drive);
					callback();
				}
			);
		});
	}
	public moveUserFile(
		username: string,
		userId: string,
		path: string,
		newPath: string
	): void {
		this.moveFile(
			genUserFolder(userId, username) + makeSlashPath(path),
			genUserFolder(userId, username) + makeSlashPath(newPath),
			() => {}
		);
	}
	private generateFolderPath(path: string, callback: () => void) {
		// path example: 2897349§1823_username/hello/world
		const folderParts = path.split("/");
		folderParts.pop();
		this.createFolderPathRecursively("", folderParts, false, callback);
	}
	public readUserFile(id: string, name: string, path: string): Promise<string> {
		return new Promise((res) => {
			const stream = fs.createReadStream(
				buildPath(
					this.getRandomDrive(),
					genUserFolder(id, name) + makeSlashPath(path)
				)
			);
			stream.on("error", (err) => {
				console.log(err);
				res("");
			});
			let chunks: Buffer[] = [];
			stream.on("data", (chunk) => {
				chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
			});
			stream.on("end", () => {
				res(Buffer.concat(chunks).toString());
			});
		});
	}
	// private readFile(path: string): Promise<{ found: boolean; data: string }> {
	// 	return new Promise((res) => {
	// 		fs.readFile(buildPath(this.getRandomDrive(), path), (err, data) => {
	// 			if (err) {
	// 				res({ found: false, data: "" });
	// 			} else {
	// 				res({ found: true, data: data.toString() });
	// 			}
	// 		});
	// 	});
	// }
	createUser(name: string, id: string): void {
		this.createFolder(genUserFolder(id, name));
		this.optimalDriveArray;
	}
}

export default new FileSystem();
