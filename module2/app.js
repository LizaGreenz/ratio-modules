import express from "express";
const app = express();
import morgan from "morgan";
import mongoose from "mongoose";
import Score from "./models/score.js";
const db = mongoose.connection;
var seconds = 0;
var gameStart;
var username;

var timeScore = setInterval(incrementSeconds, 1000);

mongoose.connect("mongodb://127.0.0.1:27017/2048", function (err) {
  if (!err) {
    console.log("no error!");
  } else {
    console.log("error: " + err);
  }
});

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

app.get("/api/v1/record", (req, res, next) => {
  db.collection("scores")
    .find({}, { _id: 0 })
    .toArray((err, result) => {
      if (err) return console.log(err);
      console.log(result);
      res.send(result);
      res.status(200);
    });
});

app.post("/api/v1/record", (req, res, next) => {
  switch (req.body.message) {
    case "Start!":
      gameStart = true;
      username = req.body.username;
      res.status(200).json({ message: req.body.message });
      break;
    case "Reloaded":
      gameStart = false;
      res.status(200).json({ message: req.body.message });
      break;
    case "Lose!":
      gameStart = false;
      break;
    case "Win!":
      gameStart = false;

      const scores = new Score({
        _id: new mongoose.Types.ObjectId(),
        username: username,
        time: seconds,
      });
      scores
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: "Scores created",
            createdScores: {
              username: result.username,
              time: result.time,
              _id: result._id,
              request: {
                type: "GET",
                url: "http://localhost:5050/api/v1/record/" + result._id,
              },
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
      clearInterval(timeScore);
  }
});

function incrementSeconds() {
  if (gameStart == true) {
    seconds += 1;
    console.log(seconds);
  } else {
    return seconds;
  }
}

export default app;
