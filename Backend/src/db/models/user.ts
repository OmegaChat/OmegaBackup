import { model, Schema } from "mongoose";

export interface user {
	_id: string;
	name: string;
	created: Date;
	password: string;
	premium: boolean;
}

export default model<user>(
	"user",
	new Schema<user>({
		name: String,
		password: String,
		created: Date,
		premium: Boolean,
	})
);
