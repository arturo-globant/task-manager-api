const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sortParam = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const split = req.query.sortBy.split(",");
    if (split.length === 2) {
      const [key, value] = split;
      sortParam[key] = value === "asc" ? 1 : -1;
    }
  }

  const limitParam = parseInt(req.query.limit);
  const skipParam = parseInt(req.query.skip);

  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: limitParam,
        skip: skipParam,
        sort: sortParam,
      },
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["description", "completed"];
  const isValidOperation = updates.every((key) => allowUpdates.includes(key));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid key names" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
