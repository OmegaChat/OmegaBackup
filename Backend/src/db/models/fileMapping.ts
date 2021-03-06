import { model, Schema } from "mongoose";

export interface fileMapping {
	_id: string;
	created: Date;
	fileName: string;
	head: boolean;
	internalFileName: string;
	filePath: string;
	mimeType: string;
	size: number;
	userId: string;
}

export default model<fileMapping>(
	"fileMapping",
	new Schema<fileMapping>({
		created: Date,
		fileName: String,
		internalFileName: String,
		filePath: String,
		mimeType: String,
		head: { type: Boolean, default: false },
		size: Number,
		userId: String,
	})
);
