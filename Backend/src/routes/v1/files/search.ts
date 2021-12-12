import { FastifyRequest, FastifyReply } from "fastify";
import fileMapping from "../../../db/models/fileMapping";
import auth from "../../../utils/auth";

export default (
	req: FastifyRequest<{ Body: { query: string } }>,
	res: FastifyReply
) => {
	auth(req).then((user) => {
		if (user) {
			if (typeof req.body.query === "string") {
				fileMapping
					.find({
						userId: user._id,
						head: true,
					})
					.then((files) => {
						if (files.length > 0) {
							const matches = files.filter((file) =>
								file.fileName.includes(req.body.query)
							);
							if (matches.length) {
								res.send({
									ok: true,
									result: matches.map((file) => {
										return {
											id: file._id,
											path: file.filePath,
											name: file.fileName,
										};
									}),
								});
							} else {
								res.status(200).send({ ok: false, error: "No files found" });
							}
						} else {
							res.status(200).send({ ok: false, error: "No files found" });
						}
					});
			} else {
				res.status(400).send({ ok: false, error: "No query specified" });
			}
		} else {
			res.code(401).send({
				error: "Unauthorized",
				ok: false,
			});
		}
	});
};
