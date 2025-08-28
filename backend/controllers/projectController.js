const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');

exports.createProject = [
  body('title').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const project = new Project({
        title: req.body.title,
        description: req.body.description,
        owner: req.user.id,
        collaborators: [req.user.id],
      });
      await project.save();
      res.json(project);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { collaborators: req.user.id }],
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user.id) && !project.collaborators.includes(req.user.id))
      return res.status(403).json({ message: 'Unauthorized' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProject = [
  body('title').optional().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      if (!project.owner.equals(req.user.id)) return res.status(403).json({ message: 'Unauthorized' });

      if (req.body.title) project.title = req.body.title;
      if (req.body.description) project.description = req.body.description;
      await project.save();
      res.json(project);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user.id)) return res.status(403).json({ message: 'Unauthorized' });

    await project.remove();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addCollaborator = [
  body('userId').isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      if (!project.owner.equals(req.user.id)) return res.status(403).json({ message: 'Unauthorized' });

      if (!project.collaborators.includes(req.body.userId)) {
        project.collaborators.push(req.body.userId);
        await project.save();
      }
      res.json(project);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.removeCollaborator = [
  body('userId').isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ message: 'Project not found' });
      if (!project.owner.equals(req.user.id)) return res.status(403).json({ message: 'Unauthorized' });

      project.collaborators = project.collaborators.filter(id => !id.equals(req.body.userId));
      await project.save();
      res.json(project);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];