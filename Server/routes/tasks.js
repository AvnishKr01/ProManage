const express = require("express")
const { body, validationResult } = require("express-validator")
const Task = require("../models/Task")
const Project = require("../models/Project")
const auth = require("../middleware/auth")

const router = express.Router()

// Get all tasks for a project
router.get("/project/:projectId", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user has access to this project
    const hasAccess = project.owner.toString() === req.user._id.toString() || project.members.includes(req.user._id)

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" })
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })

    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get single task
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "title")

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if user has access to this task's project
    const project = await Project.findById(task.project._id)
    const hasAccess = project.owner.toString() === req.user._id.toString() || project.members.includes(req.user._id)

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(task)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create new task
router.post(
  "/",
  auth,
  [
    body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
    body("description").trim().isLength({ min: 1 }).withMessage("Description is required"),
    body("dueDate").isISO8601().withMessage("Valid due date is required"),
    body("project").isMongoId().withMessage("Valid project ID is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { title, description, status, priority, dueDate, project, assignedTo, estimatedHours } = req.body

      // Check if project exists and user has access
      const projectDoc = await Project.findById(project)
      if (!projectDoc) {
        return res.status(404).json({ message: "Project not found" })
      }

      const hasAccess =
        projectDoc.owner.toString() === req.user._id.toString() || projectDoc.members.includes(req.user._id)

      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" })
      }

      const task = new Task({
        title,
        description,
        status,
        priority,
        dueDate,
        project,
        assignedTo,
        createdBy: req.user._id,
        estimatedHours,
      })

      await task.save()
      await task.populate("assignedTo", "name email")
      await task.populate("createdBy", "name email")

      res.status(201).json(task)
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },
)

// Update task
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project")

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if user has access to this task's project
    const project = await Project.findById(task.project._id)
    const hasAccess = project.owner.toString() === req.user._id.toString() || project.members.includes(req.user._id)

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" })
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project")

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if user has access to this task's project
    const project = await Project.findById(task.project._id)
    const hasAccess = project.owner.toString() === req.user._id.toString() || project.members.includes(req.user._id)

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" })
    }

    await Task.findByIdAndDelete(req.params.id)

    res.json({ message: "Task deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
