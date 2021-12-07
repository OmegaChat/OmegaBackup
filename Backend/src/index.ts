import fastify from "fastify";
import { getVolumes } from "./utils/getVolumes";
import applyRoutes from "./routes";
import db from "./db";

db;

const app = fastify();

app.get("/ping", (_, res) => {
	res.send("pong");
});

getVolumes().then((volumes) => {
	if (volumes.length > 0) {
		console.log(
			"found",
			volumes.length - 1,
			volumes.length > 2 ? "volumes" : "volume",
			"(",
			volumes.join(", "),
			")"
		);
		applyRoutes(app);
		app.listen(process.env.PORT || 3000, "0.0.0.0", (err, address) => {
			if (err) {
				console.log(err);
			} else {
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
