import { createServer } from "http";
import app from "./app.js";

const port = process.env.PORT || 5050;

const server = createServer(app).listen(port);
