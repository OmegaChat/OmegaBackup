import { FastifyInstance } from "fastify";
import v1 from "./v1";

export default (app: FastifyInstance) => {
	// v1
	v1(app);
};
