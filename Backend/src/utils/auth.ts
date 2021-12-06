import { FastifyRequest } from "fastify";
import { verify, sign } from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import secrets from "../constants/secrets";
import user, { user as userType } from "../db/models/user";

const jwtCache: { [key: string]: userType | undefined | null } = {};

export default (request: FastifyRequest): Promise<userType | undefined> => {
	return new Promise((res) => {
		if (request.headers) {
			if (typeof request.headers.auth === "string") {
				try {
					const payload = verify(request.headers.auth, secrets.JWT_SECRET);
					if (typeof payload === "object") {
						if (typeof payload.id === "string") {
							const cacheElement = jwtCache[payload.id];
							if (cacheElement === null) {
								res(undefined);
							} else {
								if (typeof cacheElement === "object") {
									res(cacheElement);
								} else {
									if (isValidObjectId(payload.id)) {
										user.findById(payload.id).then((user) => {
											if (user) {
												jwtCache[payload.id] = user;
												res(user);
											} else {
												jwtCache[payload.id] = null;
												res(undefined);
											}
										});
									} else {
										res(undefined);
									}
								}
							}
						} else {
							res(undefined);
						}
					} else {
						res(undefined);
					}
				} catch {
					res(undefined);
				}
			} else {
				res(undefined);
			}
		} else {
			res(undefined);
		}
	});
};

export const createToken = (id: string): string => {
	return sign({ id }, secrets.JWT_SECRET);
};
