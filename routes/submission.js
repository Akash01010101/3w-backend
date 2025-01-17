const express = require("express");
const multer = require("multer");
const usersub = require("../models/usersub");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

module.exports = (io) => {
  router.post("/", upload.array("images", 10), async (req, res) => {
    try {
      const { name, socialmedia } = req.body;

      const imageUrls = req.files.map((file) => {
        return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      });

      const userSub = new usersub({ name, socialmedia, images: imageUrls });
      await userSub.save();

      io.emit("new_submission", userSub);

      res.status(201).json({
        message: "Submission successful",
        data: userSub,
      });
    } catch (error) {
      console.error("Error during submission:", error.message);
      res
        .status(500)
        .json({ message: "Submission failed", error: error.message });
    }
  });

  router.get("/", async (req, res) => {
    try {
      const submissions = await usersub.find();
      res.status(200).json({ data: submissions });
    } catch (error) {
      console.error("Error fetching submissions:", error.message);
      res
        .status(500)
        .json({ message: "Failed to fetch submissions", error: error.message });
    }
  });

  return router;
};
