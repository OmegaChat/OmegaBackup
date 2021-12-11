import { FastifyReply, FastifyRequest } from "fastify";
import filesystem from "../../../utils/filesystem";
import auth from "../../../utils/auth";

export default (req: FastifyRequest, res: FastifyReply) => {
	auth(req).then((user) => {
		if (user) {
			let path = "/";
			if (req.body) {
				if (typeof (req.body as any).path === "string") {
					path = (req.body as any).path;
				}
			}
			filesystem.listFolders(user.name, user._id, path).then((folders) => {
				res.send({
					ok: true,
					result: folders,
				});
			});
		} else {
			res.status(401).send({
				ok: false,
				error: "Unauthorized",
			});
		}
	});
};
