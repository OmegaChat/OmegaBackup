import { FastifyInstance } from "fastify";
import list from "./files/list";
import upload from "./files/upload";
import loginStatus from "./user/loginStatus";
import regin from "./user/regin";
import open from "./files/open";
import info from "./files/info";

export default (app: FastifyInstance) => {
	app.post("/v1/user/regin", regin);
	app.get("/v1/user/loginStatus", loginStatus);
	app.post("/v1/files/list", list);
	app.post("/v1/files/info", info);
	app.get("/v1/files/open", open);

	app.post("/v1/file/upload", upload);
};
