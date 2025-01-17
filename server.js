require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const submissionRoutes = require("./routes/submission");
const authRoutes = require("./routes/auth");

const app = express();
const server = require('http').createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use("/api/submission", submissionRoutes(io));
app.use("/api", authRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Listening on port ${port}`));
