const http = require("http");
const app = require("./app");

const port = process.env.PORT || 5050;

const server = http.createServer(app).listen(port);