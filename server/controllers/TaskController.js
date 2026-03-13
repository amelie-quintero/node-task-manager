const Task = require("../models/Task");
const Task = require("../models/Task");
const { validateObjectId } = require("../utils/Validation");

exports.getTask = async (req, res) => {
    try {
        const tasks = await Tasks.find({user: req.user.id});
        res.status(200).json({tasks, status: true, msg: "Tasks found successfully."});
    } catch (err) {
        console.error(err);
        return res.status(500).json({status: false, msg: "Internal Server Error"});
    }
}
exports.getTask = async (req, res) => {
    try {
        if (!validateObjectId(req.params.taskId)) {
            return res.status(400).json({status: false, msg: "Invalid task id."});
        }
        const task = await Task.findById({user: req.user.id, _id: req.params.taskId});
        if (!task) {
            return res.status(400).json({status: false, msg: "No tasks found."});
        }
        res.status(200).json({task, status: true, msg: "Task found successfully."});
    } catch (err) {
        console.error(err);
        return res.status(500).json({status: false, msg: "Internal Server Error."});
    }
}
exports.postTask = async (req, res) => {
    try {
        const {description} = req.body;
        if (!description) {
            return res.status(400).json({status: false, msg: "Task description not found."});
        }
        const task = await Task.create({user: req.user.id, description});
        res.status(200).json({task, status: true, msg: "Task created successfully."});
    } catch (err) {
        console.error(err);
        return res.status(500).json({status: false, msg: "Internal Server Error."});
    }
}
exports.putTask = async (req, res) => {
    try {
        const {description} = req.body;
        if (!description) {
            return res.status(400).json({status: false, msg: "Task description not found."})
        }
        if (!validateObjectId(req.params.taskId)) {
            return res.status(400).json({status: false, msg: "Invalid task id."});
        }
        let task = await Task.findById(req.params.taskId);
        if (task.user != req.user.id) {
            return res.status(403).json({status: false, msg: "You can't update the task of another user."});
        }
        task = await Task.findByIdAndUpdate(req.params.taskId, {description}, {new: true});
        res.status(200).json({task, status: true, msg: "Task updated successfully."});
    } catch (err) {
        console.error(err);
        return res.status(500).json({status: false, msg: "Internal Server Error."});
    }
}