const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Problem schema and model
const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: String,
  tags: [String],
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
  status: { type: String, enum: ["Unsolved", "Solved", "Revision Needed"], default: "Unsolved" },
  solutionLink: String,
  date: { type: Date, default: Date.now }
});

const Problem = mongoose.model("Problem", problemSchema);

// Routes
app.get("/api/problems", async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
});

app.post("/api/problems", async (req, res) => {
  const newProblem = new Problem(req.body);
  const saved = await newProblem.save();
  res.status(201).json(saved);
});

app.put("/api/problems/:id", async (req, res) => {
  const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/api/problems/:id", async (req, res) => {
  await Problem.findByIdAndDelete(req.params.id);
  res.json({ message: "Problem deleted" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.error("MongoDB connection error:", err));
