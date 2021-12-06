import { FastifyReply, FastifyRequest } from "fastify";
import fileMapping from "../../../db/models/fileMapping";
import auth from "../../../utils/auth";
import filesystem from "../../../utils/filesystem";

const getFileName = (path: string) => {
	const pathSplit = path.split("/");
	return pathSplit[pathSplit.length - 1];
};

export default (req: FastifyRequest, res: FastifyReply) => {
	auth(req).then((user) => {
		if (user) {
			const body = req.body as any;
			if (body) {
				if (typeof body.path === "string") {
					if (typeof body.type === "string") {
						if (typeof body.data === "string") {
							fileMapping
								.findOneAndUpdate(
									{ filePath: body.path },
									{
										created: new Date(),
										fileName: getFileName(body.path),
										internalFileName: body.path,
										filePath: body.path,
										mimeType: body.type,
										size: body.data.length,
										userId: user._id,
									},
									{ upsert: true }
								)
								.then(() => {
									console.log("uploaded file (", body.data.length, "bytes");
								});
							filesystem.writeUserFile(
								user._id,
								user.name,
								body.path,
								body.data
							);
							res.send({ ok: true });
						} else {
							res.status(400).send({
								ok: false,
								error: "data must be a string",
							});
						}
					} else {
						res.status(400).send({
							ok: false,
							error: "Invalid type",
						});
					}
				} else {
					res.status(400).send({
						ok: false,
						error: "Invalid path",
					});
				}
			} else {
				res.status(400).send({
					error: "empty request body",
					ok: false,
				});
			}
		} else {
			res.status(401).send({
				error: "Unauthorized",
			});
		}
	});
};
