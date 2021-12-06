import { model, Schema } from "mongoose";

interface fileMapping {
	_id: string;
	created: Date;
	fileName: string;
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
		size: Number,
		userId: String,
	})
);
