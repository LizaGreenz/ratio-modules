/* const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const Score = require("../models/score").default;

router.get("/", (req, res, next) => {
  Score.find()
    .select("username _id time")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        score: docs.map((doc) => {
          return {
            username: doc.username,
            time: doc.time,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:5050/api/v1/record/" + doc.id,
            },
          };
        }),
      };

      // if (docs.length >= 0) {
      res.status(200).json(response);
      // } else {
      //     res.status(404).json({ message: "No entries found" });
      //   }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const scores = new Score({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    time: req.body.time,
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
});

router.get("/:scoreId", (req, res, next) => {
  const id = req.params.scoreId;
  Score.findById(id)
    .select("username time _id")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:5050/api/v1/record",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:scoreId", (req, res, next) => {
  const id = req.params.scoreId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Score.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated successfully",
        request: {
          type: "GET",
          url: "http://localhost:5050/api/v1/record" + id,
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:scoreId", (req, res, next) => {
  const id = req.params.scoreId;
  Score.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Score deleted successfully",
        request: {
          type: "POST",
          url: "http://localhost:5050/api/v1/record",
          body: { username: "String", time: "Number" },
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
 */
