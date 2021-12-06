import { config } from "dotenv";

export default config().parsed as { JWT_SECRET: string };
