import { FastifyReply, FastifyRequest } from "fastify";
import fileMapping from "../../../db/models/fileMapping";
import auth from "../../../utils/auth";
import filesystem from "../../../utils/filesystem";
import { Buffer } from "buffer";

// replace last occurrence of a string
const replaceLast = (str: string, find: string, replace: string) => {
	return str.replace(new RegExp(find + "($| )", "g"), replace + "$1");
};

const getFileName = (path: string) => {
	const pathSplit = path.split("/");
	return pathSplit[pathSplit.length - 1];
};

const injectId = (path: string, id: string): string => {
	const fileName = getFileName(path);
	return replaceLast(path, fileName, "") + "history-" + id + fileName;
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
								.findOne({ filePath: body.path, head: true })
								.then((file) => {
									console.log(file);
									fileMapping.create({
										created: new Date(),
										fileName: getFileName(body.path),
										internalFileName: body.path,
										filePath: body.path,
										head: true,
										mimeType: body.type,
										size: body.data.length,
										userId: user._id,
									});
									if (file) {
										filesystem.moveUserFile(
											user.name,
											user._id,
											body.path,
											injectId(body.path, file._id.toString())
										);
										fileMapping
											.findByIdAndUpdate(file._id, {
												internalFileName: injectId(body.path, file._id),
												head: false,
											})
											.then((c) => {
												console.log(c);
											});
									}
								});
							filesystem.writeUserFile(
								user._id,
								user.name,
								body.path,
								Buffer.from(body.data, "base64")
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
