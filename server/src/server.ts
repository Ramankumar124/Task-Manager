import http from "http";
import app from "./app";
import dotenv from "dotenv";
import { DBConnection } from "./database";
dotenv.config();

const PORT = process.env.PORT || 5000;

DBConnection();

const server = http.createServer(app);

server.listen(PORT, function () {
  console.info(`Server running at Port ${PORT}`);
});
