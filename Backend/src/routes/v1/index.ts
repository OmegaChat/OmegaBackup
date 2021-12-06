import { FastifyInstance } from "fastify";
import upload from "./files/upload";
import loginStatus from "./user/loginStatus";
import regin from "./user/regin";

export default (app: FastifyInstance) => {
	app.post("/v1/user/regin", regin);
	app.get("/v1/user/loginStatus", loginStatus);

	app.post("/v1/file/upload", upload);
};
