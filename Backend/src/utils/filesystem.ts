import fs from "fs";
import { getVolumes, getFiles } from "./getVolumes";

const allowedCharacterRegex = /[A-Za-z]+/g;

const buildPath = (volume: string, path: string) =>
	"/Volumes/" + volume + "/" + path;

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
		const now = new Date().getTime().toString();
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
		const matches = name.match(allowedCharacterRegex);
		this.createFolder(id + "_" + (matches ? matches.join("-") : ""));
		this.optimalDriveArray;
		this.writeFile;
	}
}

export default new FileSystem();
