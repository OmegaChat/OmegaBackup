import fastify from "fastify";
import { getVolumes } from "./utils/getVolumes";
import applyRoutes from "./routes";
import cors from "fastify-cors";
import db from "./db";
import registerWorker from "./utils/registerWorker";
db;

const app = fastify({ bodyLimit: 52428800 });

app.register(cors, {
	origin: [
		"http://backup.omega.com",
		"http://omega.backup.com:3000",
		"http://192.168.100.50",
	],
	credentials: true,
});

app.get("/ping", (_, res) => {
	res.send("pong");
});

getVolumes().then((volumes) => {
	if (volumes.length > 0) {
		console.log(
			"found",
			volumes.length,
			volumes.length > 1 ? "volumes" : "volume",
			"(",
			volumes.join(", "),
			")"
		);
		applyRoutes(app);
		app.listen(process.env.PORT || 3000, "0.0.0.0", (err, address) => {
			if (err) {
				console.log(err);
			} else {
				registerWorker();
				console.log("omegabackup is running on", address);
			}
		});
	} else {
		console.log(
			"in order for omegaBackup to work, it is recommended to use at least one external volume"
		);
		process.exit(0);
	}
});
