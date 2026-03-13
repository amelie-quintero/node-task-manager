const Task = require("../models/Task");
const { validateObjectId } = require("../utils/Validation");

exports.getTask = async (req, res) => {
    try {
        const tasks = await Tasks.find({user: req.user.id});
        res.status(200).json({tasks, status: true, msg: "Tasks found successfully."});
    } catch (err) {
        console.error(err);
        res.status(500).json({status: false, msg: "Internal Server Error"});
    }
}
exports.getTask = async (req, res) => {
    try {
        if (!validateObjectId(req.params.taskId)) {
            return res.status(400).json({status: false, msg: "Invalid task id."});
        }
        const task = await Task.findById({user: req.user.id, _id: req.params.taskId});
        if (!task) {
            res.status(400).json({status: false, msg: "No tasks found."});
        }
        res.status(200).json({task, status: true, msg: "Task found successfully."});
    } catch (err) {
        console.error(err);
        return res.status(500).json({status: false, msg: "Internal Server Error."});
    }
}