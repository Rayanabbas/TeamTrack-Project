const Task = require('../models/Task');
const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');

exports.createTask = [
  body('title').notEmpty(),
  body('status').optional().isIn(['à faire', 'en cours', 'terminé']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const project = await Project.findById(req.params.projectId);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      if (!project.owner.equals(req.user.id) && !project.collaborators.includes(req.user.id))
        return res.status(403).json({ message: 'Unauthorized' });

      const task = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status || 'à faire',
        project: req.params.projectId,
        assignedTo: req.body.assignedTo,
      });
      await task.save();
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.getTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user.id) && !project.collaborators.includes(req.user.id))
      return res.status(403).json({ message: 'Unauthorized' });

    const tasks = await Task.find({ project: req.params.projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = [
  body('title').optional().notEmpty(),
  body('status').optional().isIn(['à faire', 'en cours', 'terminé']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });

      const project = await Project.findById(task.project);
      if (!project.owner.equals(req.user.id) && !project.collaborators.includes(req.user.id))
        return res.status(403).json({ message: 'Unauthorized' });

      if (req.body.title) task.title = req.body.title;
      if (req.body.description) task.description = req.body.description;
      if (req.body.status) task.status = req.body.status;
      if (req.body.assignedTo) task.assignedTo = req.body.assignedTo;
      await task.save();
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (!project.owner.equals(req.user.id) && !project.collaborators.includes(req.user.id))
      return res.status(403).json({ message: 'Unauthorized' });

    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};