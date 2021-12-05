import fs from "fs";
import { getVolumes, getFiles } from "./getVolumes";

const allowedCharacterRegex = /[A-Za-z]+/g;

const buildPath = (volume: string, path: string) =>
	"/Volumes/" + volume + "/" + path;

class FileSystem {
	private operationalDrives: string[] = [];
	private primaryDrives: string[] = [];
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
		console.log("Primary drives:", this.primaryDrives.join(", "));
	}
	constructor() {
		getVolumes().then((volumes) => {
			let coveredVolumes = 0;
			volumes.forEach((volume) => {
				getFiles("/Volumes/" + volume + "/").then((files) => {
					if (files && files.length) {
						if (files.includes(".omega_lastbackup")) {
							fs.readFile(
								"/Volumes/" + volume + "/.omega_lastbackup",
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
		if (this.primaryDrives.includes(drive)) {
			fs.writeFile(
				buildPath(drive, "/.omega_lastbackup"),
				new Date().toString(),
				(err) => {
					if (err) {
						console.log(err);
					}
				}
			);
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
	createUser(name: string, id: string): void {
		const matches = name.match(allowedCharacterRegex);
		this.createFolder(id + "_" + (matches ? matches.join("-") : ""));
	}
}

export default new FileSystem();
