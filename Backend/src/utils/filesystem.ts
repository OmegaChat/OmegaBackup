import fs from "fs";
import { getVolumes, getFiles, getFolders } from "./getVolumes";

const allowedCharacterRegex = /[A-Za-z]+/g;

const makeSlashPath = (path: string) =>
	(path[0] === "/" ? "" : "/") + replaceAll(path, "..", "");

// const makePath = (path: string) => {
// 	while (path[0] === "/") {
// 		path = path.substr(1);
// 	}
// 	return replaceAll(path, "..", "");
// };
const replaceAll = (str: string, find: string, replace: string) => {
	return str.split(find).join(replace);
};

const buildPath = (volume: string, path: string) =>
	"/Volumes/" + volume + "/" + replaceAll(path, "..", "");

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
	private optimalDriveArray: string[] = [];
	private getRandomDrive(): string {
		return this.primaryDrives[
			Math.floor(Math.random() * this.primaryDrives.length)
		];
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
											this.pickPrimaryDrive();
										}
									} else {
										getFiles("/Volumes/" + volume + "/").then((files) => {
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
												this.pickPrimaryDrive();
											}
										});
									}
								}
							);
						} else {
							getFiles("/Volumes/" + volume + "/").then((files) => {
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
	private createFolder(path: string): void {
		this.getWritableDrives().forEach((drive) => {
			fs.mkdir(buildPath(drive, path), (err) => {
				if (err) {
					console.log(err);
				}
				this.updateLastBackup(drive);
			});
		});
	}
	public writeUserFile(
		id: string,
		name: string,
		path: string,
		data: string
	): void {
		this.generateFolderPath(
			genUserFolder(id, name) + makeSlashPath(path),
			() => {
				this.writeFile(genUserFolder(id, name) + makeSlashPath(path), data);
			}
		);
	}
	private writeFile(path: string, data: string): void {
		this.getWritableDrives().forEach((drive) => {
			fs.writeFile(buildPath(drive, path), data, (err) => {
				if (err) {
					console.log(err);
				}
				this.updateLastBackup(drive);
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
				this.createFolder(initialPath + addElement);
				parts.shift();
				this.createFolderPathRecursively(
					initialPath + addElement + "/",
					parts,
					rapidCreate,
					callback
				);
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
							this.createFolder(initialPath + addElement);
							parts.shift();
							this.createFolderPathRecursively(
								initialPath + addElement + "/",
								parts,
								true,
								callback
							);
						}
					}
				);
			}
		} else {
			callback();
		}
	}
	private generateFolderPath(path: string, callback: () => void) {
		// path example: 2897349§1823_username/hello/world
		const folderParts = path.split("/");
		folderParts.pop();
		this.createFolderPathRecursively("", folderParts, false, callback);
	}
	public readFile(path: string): Promise<{ found: boolean; data: string }> {
		return new Promise((res) => {
			fs.readFile(buildPath(this.getRandomDrive(), path), (err, data) => {
				if (err) {
					res({ found: false, data: "" });
				} else {
					res({ found: true, data: data.toString() });
				}
			});
		});
	}
	createUser(name: string, id: string): void {
		this.createFolder(genUserFolder(id, name));
		this.optimalDriveArray;
		this.writeFile;
	}
}

export default new FileSystem();
