import { FastifyReply, FastifyRequest } from "fastify";
import user, { user as userSchema } from "../../../db/models/user";
import { compare, hashSync } from "bcrypt";
import filesystem from "../../../utils/filesystem";
import { createToken } from "../../../utils/auth";

interface body {
	name?: string;
	password?: string;
}

export default (req: FastifyRequest, res: FastifyReply) => {
	if (req.body) {
		const body = req.body as body;
		if (typeof body.name === "string" && body.name.length) {
			if (typeof body.password === "string") {
				user.findOne({ name: body.name }, (err: any, usr?: userSchema) => {
					if (err) {
						console.log(err);
						res.status(500).send({
							ok: false,
							error: "Internal Server Error",
						});
					} else {
						if (usr && body.password) {
							compare(body.password, usr.password, (err, correct) => {
								if (err) {
									console.log(err);
								}
								if (correct) {
									const token = createToken(usr._id);
									res.header("set-cookie", `omegatoken=${token}; HttpOnly; Max-Age=${604800000}; Path=/`);
									res.send({
										ok: true,
										result: { token: token },
									});
								} else {
									res.status(401).send({
										ok: false,
										error: "incorrect password",
									});
								}
							});
						} else if (body.password && body.name) {
							if (body.name.length < 30) {
								user
									.create({
										name: body.name,
										password: hashSync(body.password, 10),
									})
									.then((createdUser) => {
										const token = createToken(createdUser._id)
										filesystem.createUser(createdUser.name, createdUser._id);
										res.header("set-cookie", `omegatoken=${token}; HttpOnly; Max-Age=${604800000}; Path=/`);
										res.send({
											ok: true,
											result: { token: createToken(createdUser._id) },
										});
									});
							} else {
								res.status(400).send({
									ok: false,
									error: "name is too long",
								});
							}
						} else {
							res
								.status(500)
								.send({ ok: false, error: "Internal Server Error" });
						}
					}
				});
			} else {
				res.status(400).send({ ok: false, error: "password is not a string" });
			}
		} else {
			res.status(400).send({ ok: false, error: "name is not string" });
		}
	} else {
		res.status(400).send({ ok: false, error: "no request body" });
	}
};
