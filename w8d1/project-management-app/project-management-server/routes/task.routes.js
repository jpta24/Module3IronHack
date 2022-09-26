const router = require('express').Router();
// const mongoose = require('mongoose');

const Task = require('../models/Task.model');
const Project = require('../models/Project.model');

//  POST /api/tasks  -  Creates a new task
router.post('/tasks', (req, res, next) => {
	const { title, description, projectId } = req.body;

	Task.create({ title, description, project: projectId })
		.then((newTask) => {
			return Project.findByIdAndUpdate(
				projectId,
				{ $push: { tasks: newTask._id } },
				{ new: true }
			);
		})
		.then((project) => res.json(project))
		.catch((err) => res.json(err));
});

router.put('/tasks/:taskId', (req, res, next) => {
  const { taskId } = req.params;
	const { title, description } = req.body;

	Task.findByIdAndUpdate(taskId, { title, description }, { new: true })
		.then(task => res.json(task))
    .catch(err => console.log(err))
});

router.delete('/tasks/:taskId',(req, res) => {
  const { taskId } = req.params;
  Task.findByIdAndRemove(taskId)
        .then(task => {
          Project.findByIdAndUpdate(task.project, {$pull: {tasks:taskId}}, {new:true})
        })
        .then((project)=> res.json({message: `Task ${taskId} was successfully deleted and the Project ${project.id} was updated`}))
        .catch(err => console.log(err))

})

router.get('/tasks',(req, res) => {
  Task.find()
  .then(tasks => res.json(tasks))
} )

module.exports = router;
