import { FastifyReply, FastifyRequest } from "fastify";
import auth from "../../../utils/auth";

export default (req: FastifyRequest, res: FastifyReply) => {
	auth(req).then((user) => {
		if (user) {
			res.send({ ok: true, result: user.name });
		} else {
			res.status(401).send({ ok: false });
		}
	});
};
