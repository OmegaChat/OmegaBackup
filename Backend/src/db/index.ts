import mongoose from "mongoose";
import "./models";

mongoose.connect("mongodb://omegaBackup:1234@db:27017/admin")

export default mongoose;