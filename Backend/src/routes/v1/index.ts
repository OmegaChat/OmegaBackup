import { FastifyInstance } from "fastify";
import loginStatus from "./user/loginStatus";
import regin from "./user/regin";

export default (app: FastifyInstance) => {
	app.post("/v1/user/regin", regin);
	app.get("/v1/user/loginStatus", loginStatus);
};
