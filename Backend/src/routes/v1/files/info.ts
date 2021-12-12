import { FastifyReply, FastifyRequest } from "fastify";
import auth from "../../../utils/auth";
import fileMapping from "../../../db/models/fileMapping";
import { makeSlashPath } from "../../../utils/filesystem";

export default (
	req: FastifyRequest<{ Body: { path: string } }>,
	res: FastifyReply
) => {
	auth(req).then((user) => {
		if (user) {
			if (req.body) {
				if (typeof req.body.path === "string") {
					const path = makeSlashPath(req.body.path);
					fileMapping
						.find({
							filePath: path,
							userId: user._id,
						})
						.then((fileMappings) => {
							if (fileMappings.length === 0) {
								res.status(404).send({ ok: false, error: "File not found" });
							} else {
								let head:
									| {
											created: number;
											path: string;
											mimeType: string;
											fileName: string;
									  }
									| {} = {};
								const versions: { created: number; path: string }[] = [];
								fileMappings.forEach((fm) => {
									if (fm.head === true) {
										head = {
											created: fm.created.getTime(),
											path: fm.filePath,
											mimeType: fm.mimeType,
											fileName: fm.fileName,
										};
									} else {
										versions.push({
											created: fm.created.getTime(),
											path: fm.internalFileName,
										});
									}
								});
								if (head) {
									res.send({ ok: true, result: { head, versions } });
								} else {
									res
										.status(404)
										.send({ ok: false, error: "No File Mappings found" });
								}
							}
						});
				}
			}
		} else {
			res.status(401).send({
				ok: false,
				error: "Unauthorized",
			});
		}
	});
};
