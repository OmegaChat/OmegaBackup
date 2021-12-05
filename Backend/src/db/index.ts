import mongoose from "mongoose";
import "./models";

mongoose.connect("mongodb://omegaBackup:1234@localhost:27017/admin", (err) => {
	if (err) {
		console.error(err);
	}
});

export default mongoose;
