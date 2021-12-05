import { FastifyInstance } from "fastify";
import regin from "./user/regin";

export default (app: FastifyInstance) => {
	app.post("/v1/user/regin", regin);
};
