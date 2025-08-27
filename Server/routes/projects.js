const express = require("express")
const { body, validationResult } = require("express-validator")
const Project = require("../models/Project")
const Task = require("../models/Task")
const auth = require("../middleware/auth")

const router = express.Router()

// Get all projects for user
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 })

    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get single project
router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email")

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user has access to this project
    const hasAccess =
      project.owner._id.toString() === req.user._id.toString() ||
      project.members.some((member) => member._id.toString() === req.user._id.toString())

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(project)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create new project
router.post(
  "/",
  auth,
  [
    body("title").trim().isLength({ min: 1 }).withMessage("Title is required"),
    body("description").trim().isLength({ min: 1 }).withMessage("Description is required"),
    body("endDate").isISO8601().withMessage("Valid end date is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { title, description, status, priority, startDate, endDate, members } = req.body

      const project = new Project({
        title,
        description,
        status,
        priority,
        startDate: startDate || Date.now(),
        endDate,
        owner: req.user._id,
        members: members || [],
      })

      await project.save()
      await project.populate("owner", "name email")
      await project.populate("members", "name email")

      res.status(201).json(project)
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },
)

// Update project
router.put("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" })
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate("owner", "name email")
      .populate("members", "name email")

    res.json(updatedProject)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" })
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id })

    // Delete the project
    await Project.findByIdAndDelete(req.params.id)

    res.json({ message: "Project deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
