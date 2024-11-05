import dotenv from "dotenv";
import app from "./app";
import { logger } from "./utils/logger";
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(
    `Server Running Environment: ${process.env.NODE_ENV}, PORT:  ${PORT} 🚀 `
  );
});
